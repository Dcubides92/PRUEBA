import pandas as pd
import pyodbc
from datetime import timedelta
import re
import numpy as np

# 1. Conexión a SQL Server
conn = pyodbc.connect(
    'DRIVER={ODBC Driver 17 for SQL Server};'
    'SERVER=colbogsql41\\mssql41_kpi;'
    'DATABASE=ATENTO_ACP;'
    'Trusted_Connection=yes;'
)

def extraer_HyM(turno):
    if turno != "":
            # Usar expresión regular para extraer las horas
            match = re.search(r'(\d{2}):(\d{2})\s+a\s+(\d{2}):(\d{2})', turno, re.IGNORECASE)
            if match:
                hora_inicio = int(match.group(1))
                minutos_inicio = int(match.group(2))
                hora_fin = int(match.group(3))
                minutos_fin = int(match.group(4))
                #if hora_fin < hora_inicio:
                #    hora_fin= hora_fin + 24
                return hora_inicio, minutos_inicio, hora_fin, minutos_fin  # Devolver como enteros
    return None,None,None,None

# Función para extraer horas de inicio y fin
def extraer_horas(turno: object):
    star,star_minute,end,end_minute = extraer_HyM(turno)
    if star!=None:
            return {
                'inicio': f"{star:02}:{star_minute:02}",  # Formato HH:MM
                'fin': f"{end:02}:{end_minute:02}"           # Formato HH:MM
                #'Horas_Totales': total_horas
            }
    return {'inicio': None, 'fin': None}  # Devuelve None si está vacío o no se encuentra el patrón

def calcular_tiempo(turno: object ):
    star,star_minute,end,end_minute = extraer_HyM(turno)
     # Calcular el total de horas en formato decimal
    if star!=None:
        total_horas = (end + end_minute / 60) - (star + star_minute / 60)
        return total_horas # Convertir a horas
    return  0

# Función para convertir horas a minutos
def horas_a_minutos(hora):
    if hora is not None:
        h, m = map(int, hora.split(':'))
        return h * 60 + m
    return None

# 2. Ejecutar tu consulta completa
query = """
SELECT 
C.Cedula,
C.Asesor,
C.Dia,
C.Turno_Dia,
C.Codigo_Campaña,
C.Campaña,
E.[LOCAL],
E.TIPO_GESTION,
B.SERVICIO,
B.LOB,
B.SEDEF,
IIF(E.[LOCAL] IS NULL, B.SEDEF, E.[LOCAL]) AS LOCAL_FINAL
FROM [ATENTO_ACP].dbo.TBL_TTURNOS_GAP_TORRE AS C
LEFT JOIN (
    SELECT DISTINCT Cc, [LOCAL], TIPO_GESTION 
    FROM [ATENTO_ACP].dbo.Tbl_Usuarios_Consolidado_Atento
) AS E ON C.Cedula=E.Cc
LEFT JOIN dbo.ArbolDefinitivoWFM AS B on C.[Campaña]=B.[SERVICIO]
WHERE C.Dia BETWEEN '2025-12-15' AND '2026-01-18'
AND C.Cargo IN (
    'RAC APRENDIZ','AGENTE SERVICIOS ESPEC PROF TRANSVERSALES',
    'ASESOR REFENCIA/CONTRAREFERENCIA','AGENTE TRANSACCIONAL',
    'MEDICO ORIENTADOR','RAC PRESENCIAL','RAC EXPERTO',
    'RAC VENTAS','RAC TELEFONICO','RAC BO','SUPERVISOR DE OPERACIONES',
    'AGENTE CALL CENTER PUESTO DE TRABAJO 5X8','ASESOR LINEA AMIGA',
    '   SUPERVISOR BILINGUE','SUPERVISOR BILINGUE'
)
"""

df = pd.read_sql(query, conn)
df[['hora_inicio','hora_fin']] = df['Turno_Dia'].apply(extraer_horas).apply(pd.Series)
df['hora_inicio'] = pd.to_datetime(df['hora_inicio'], format='%H:%M', errors='coerce').dt.time
df['hora_fin'] = pd.to_datetime(df['hora_fin'], format='%H:%M', errors='coerce').dt.time
df['inicio_dt'] = pd.to_datetime(df['Dia'].astype(str) + ' ' + df['hora_inicio'].astype(str), 
                                 format='%Y-%m-%d %H:%M:%S',
                                 errors='coerce')
df['fin_dt'] = pd.to_datetime(df['Dia'].astype(str) + ' ' + df['hora_fin'].astype(str), 
                              format='%Y-%m-%d %H:%M:%S',
                              errors='coerce')
df=df.dropna(subset=['LOCAL_FINAL']).reset_index(drop=True)
df['LOCAL_FINAL'] = df.apply(
        lambda row: 'SEDE PARQUE OLAYA' if row['LOCAL_FINAL'] == 'SEDE OLAYA' else row['LOCAL_FINAL'],
        axis=1
    )
# Ajustar fin_dt si es menor que inicio_dt (turnos que cruzan medianoche)
df.loc[df['fin_dt'] < df['inicio_dt'], 'fin_dt'] += pd.Timedelta(days=1)

# 1. Generar intervalos dinámicos
min_dt = df['inicio_dt'].min().floor('D')
#max_dt = (df['fin_dt'].max() + pd.Timedelta(days=1)).ceil('D')
max_dt = df['fin_dt'].max().ceil('D')
intervalos = pd.date_range(min_dt, max_dt, freq='30min')
bloque_fin = intervalos + pd.Timedelta(minutes=30)

# Arrays para cálculo
inicio_turnos = df['inicio_dt'].dropna().unique()
fin_turnos = df['fin_dt'].dropna().unique()
lobs = df['LOB'].dropna().unique()
sedes = df['LOCAL_FINAL'].dropna().unique()
modalidades = df['TIPO_GESTION'].dropna().unique()

# Crear tabla base
tabla = []
intervalos = np.array(intervalos)       # Convertir a NumPy
bloque_fin = np.array(bloque_fin)       # Convertir a Numpy

# Iterar por combinaciones
for lob in lobs:
    for sede in sedes:
        for modalidad in modalidades:
            mask_turnos = (
                (df['LOB'] == lob) &
                (df['LOCAL'] == sede) &
                (df['TIPO_GESTION'] == modalidad)
            )
            inicio_sel = df.loc[mask_turnos, 'inicio_dt'].values
            fin_sel = df.loc[mask_turnos, 'fin_dt'].values

            if len(inicio_sel) > 0:
                hc_mask = ((inicio_sel[:, None] <= intervalos) &
                       (fin_sel[:, None] >= bloque_fin))
                entradas_mask = ((inicio_sel[:, None] >= intervalos) &
                                (inicio_sel[:, None] < bloque_fin))
                salidas_mask = ((fin_sel[:, None] >= intervalos) &
                            (fin_sel[:, None] < bloque_fin))
                tabla.append(pd.DataFrame({
                'Intervalo_dt': intervalos,
                'bloque_fin':bloque_fin,
                'LOB': lob,
                'Sede': sede,
                'Modalidad': modalidad,
                'HC Scheduled': hc_mask.sum(axis=0),
                'Entradas': entradas_mask.sum(axis=0),
                'Salidas': salidas_mask.sum(axis=0)
                }))
            continue  # No hay turnos para esta combinación

            # Broadcasting: turnos x intervalos

resultado = pd.concat(tabla)

# Exportar
df.to_excel('Programacion.xlsx', index=False)
resultado.to_excel('programacion_intervalos_V4.xlsx', index=False)
