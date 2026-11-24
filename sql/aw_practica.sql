-- ================================================================
-- UNIVERSIDAD COMPLUTENSE DE MADRID · APLICACIONES WEB 2026-2027
-- PRACTICA OBLIGATORIA: CENTRO DE FORMACION
-- ESQUEMA OFICIAL Y UNICO · MariaDB / XAMPP
-- ================================================================
-- Este script define el MODELO COMUN para todos los grupos.
-- No se permite crear otras tablas, renombrar columnas ni cambiar
-- tipos, claves o relaciones. No utiliza DROP: conserva datos.
-- Ejecutar desde phpMyAdmin (Importar) o cliente MariaDB.
-- ================================================================

CREATE DATABASE IF NOT EXISTS aw_practica
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE aw_practica;

-- 1. USUARIOS (alumnos y administradores)
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario       INT UNSIGNED NOT NULL AUTO_INCREMENT,
    nombre           VARCHAR(100) NOT NULL,
    email            VARCHAR(150) NOT NULL,
    password         VARCHAR(255) NOT NULL,
    rol              ENUM('alumno', 'admin') NOT NULL DEFAULT 'alumno',
    fecha_registro   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    activo           BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT pk_usuarios PRIMARY KEY (id_usuario),
    CONSTRAINT uq_usuarios_email UNIQUE (email)
) ENGINE=InnoDB;

-- EXCEPCION DOCENTE 2026-2027: en esta practica local se admiten
-- contrasenas en texto claro para simplificar el login.
-- En aplicaciones reales deben almacenarse con un hash seguro
-- especifico para contrasenas (p. ej., Argon2id o bcrypt).

-- 2. DOCENTES
CREATE TABLE IF NOT EXISTS docentes (
    id_docente       INT UNSIGNED NOT NULL AUTO_INCREMENT,
    nombre           VARCHAR(100) NOT NULL,
    email            VARCHAR(150) NOT NULL,
    especialidad     VARCHAR(100) NOT NULL,
    telefono         VARCHAR(20) NULL,
    foto             VARCHAR(255) NULL,
    activo           BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT pk_docentes PRIMARY KEY (id_docente),
    CONSTRAINT uq_docentes_email UNIQUE (email)
) ENGINE=InnoDB;

-- 3. AULAS
CREATE TABLE IF NOT EXISTS aulas (
    id_aula          INT UNSIGNED NOT NULL AUTO_INCREMENT,
    nombre           VARCHAR(50) NOT NULL,
    edificio         VARCHAR(50) NOT NULL,
    planta           VARCHAR(20) NULL,
    capacidad        INT UNSIGNED NOT NULL,
    equipamiento     TEXT NULL,
    estado           ENUM('activa', 'inactiva') NOT NULL DEFAULT 'activa',
    CONSTRAINT pk_aulas PRIMARY KEY (id_aula),
    CONSTRAINT chk_aulas_capacidad CHECK (capacidad > 0)
) ENGINE=InnoDB;

-- 4. CURSOS
CREATE TABLE IF NOT EXISTS cursos (
    id_curso         INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_docente       INT UNSIGNED NOT NULL,
    id_aula          INT UNSIGNED NOT NULL,
    nombre           VARCHAR(100) NOT NULL,
    descripcion      TEXT NULL,
    fecha_inicio     DATE NOT NULL,
    fecha_fin        DATE NOT NULL,
    horario          VARCHAR(100) NULL,
    plazas           INT UNSIGNED NOT NULL,
    imagen           VARCHAR(255) NULL,
    estado           ENUM('activo', 'inactivo') NOT NULL DEFAULT 'activo',
    CONSTRAINT pk_cursos PRIMARY KEY (id_curso),
    CONSTRAINT fk_cursos_docentes FOREIGN KEY (id_docente)
        REFERENCES docentes (id_docente)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_cursos_aulas FOREIGN KEY (id_aula)
        REFERENCES aulas (id_aula)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT chk_cursos_fechas CHECK (fecha_fin >= fecha_inicio),
    CONSTRAINT chk_cursos_plazas CHECK (plazas > 0),
    INDEX idx_cursos_docente (id_docente),
    INDEX idx_cursos_aula (id_aula)
) ENGINE=InnoDB;

-- 5. MATRICULAS
CREATE TABLE IF NOT EXISTS matriculas (
    id_matricula     INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_usuario       INT UNSIGNED NOT NULL,
    id_curso         INT UNSIGNED NOT NULL,
    fecha_matricula  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado           ENUM('activa', 'cancelada') NOT NULL DEFAULT 'activa',
    CONSTRAINT pk_matriculas PRIMARY KEY (id_matricula),
    CONSTRAINT uq_matriculas_usuario_curso UNIQUE (id_usuario, id_curso),
    CONSTRAINT fk_matriculas_usuarios FOREIGN KEY (id_usuario)
        REFERENCES usuarios (id_usuario)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_matriculas_cursos FOREIGN KEY (id_curso)
        REFERENCES cursos (id_curso)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    INDEX idx_matriculas_curso (id_curso)
) ENGINE=InnoDB;

-- ================================================================
-- REGLAS QUE DEBE APLICAR EL SERVIDOR (no basta con las FK)
-- ================================================================
-- 1. Solo usuarios con rol 'alumno' pueden matricularse.
-- 2. El usuario debe estar activo y el curso en estado 'activo'.
-- 3. Antes de crear/activar matricula, comprobar plazas libres
--    contando SOLO matriculas en estado 'activa'. Debe hacerse
--    con transaccion / bloqueo para evitar sobreocupacion simultanea.
-- 4. No se puede duplicar una pareja (id_usuario, id_curso).
--    Si existe cancelada, reactivarla con UPDATE y actualizar
--    fecha_matricula; NO insertar una segunda fila.
-- 5. Cancelar = UPDATE estado='cancelada'; NO DELETE.
-- 6. Solo 'admin' puede crear, modificar o eliminar cursos.
-- 7. Consultas SQL parametrizadas; validacion en servidor.
-- 8. 'foto' e 'imagen' almacenan rutas/identificadores relativos,
--    NUNCA datos binarios ni rutas elegidas por el cliente.
--    Verificar tipo real, tamano y nombre seguro al subir archivos.
-- 9. Las FK impiden borrar un docente/aula con cursos asociados
--    y un curso con matriculas. Se puede desactivar en su lugar.
-- 10. La capacidad fisica de un aula y el numero de plazas
--     ofertadas del curso se comprobaran segun la logica de negocio.
-- ================================================================

-- Consultas de comprobacion (descomentar en phpMyAdmin):
-- SHOW TABLES;
-- SHOW CREATE TABLE cursos;
-- SHOW CREATE TABLE matriculas;