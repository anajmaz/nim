-- Avalia se um banco de dados com o nome que iremos usar existe, se existe, exclui ele
use master
go

if exists(select * from sys.databases where name = 'NimGameDB')
	drop database NimGameDB
go

-- Criação do banco de dados
CREATE DATABASE NimGameDB;
GO

USE NimGameDB;
GO

-- Tabela de usuários com senha em hash
CREATE TABLE Usuarios (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Nome NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    SenhaHash NVARCHAR(64) NOT NULL, -- SHA-256 gera 64 caracteres hexadecimais
    DataCadastro DATETIME DEFAULT GETDATE()
);
GO

-- Tabela de níveis de dificuldade (para IA)
CREATE TABLE Dificuldades (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Nome NVARCHAR(50) NOT NULL,
    Descricao NVARCHAR(255)
);
GO

-- Tabela de partidas
CREATE TABLE Partidas (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Jogador1Id INT NOT NULL,
    Jogador2Id INT NULL, -- NULL se for contra IA
    ContraIA BIT NOT NULL,
    DificuldadeId INT NULL,
    VencedorId INT NULL,
    DataInicio DATETIME DEFAULT GETDATE(),
    DataFim DATETIME NULL,
    FOREIGN KEY (Jogador1Id) REFERENCES Usuarios(Id),
    FOREIGN KEY (Jogador2Id) REFERENCES Usuarios(Id),
    FOREIGN KEY (VencedorId) REFERENCES Usuarios(Id),
    FOREIGN KEY (DificuldadeId) REFERENCES Dificuldades(Id)
);
GO

-- Ranking agregado
CREATE TABLE Ranking (
    UsuarioId INT PRIMARY KEY,
    Vitorias INT DEFAULT 0,
    Derrotas INT DEFAULT 0,
    PartidasContraIA INT DEFAULT 0,
    PartidasContraJogador INT DEFAULT 0,
    FOREIGN KEY (UsuarioId) REFERENCES Usuarios(Id)
);
GO

-- Trigger para atualizar o ranking
CREATE TRIGGER trg_AtualizaRanking
ON Partidas
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT * FROM inserted WHERE VencedorId IS NOT NULL)
    BEGIN
        DECLARE @jogador1 INT, @jogador2 INT, @vencedor INT, @contraIA BIT;
        SELECT @jogador1 = Jogador1Id, @jogador2 = Jogador2Id, @vencedor = VencedorId, @contraIA = ContraIA
        FROM inserted;

        IF NOT EXISTS (SELECT 1 FROM Ranking WHERE UsuarioId = @jogador1)
            INSERT INTO Ranking (UsuarioId) VALUES (@jogador1);
        IF @jogador2 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM Ranking WHERE UsuarioId = @jogador2)
            INSERT INTO Ranking (UsuarioId) VALUES (@jogador2);

        UPDATE Ranking
        SET Vitorias = Vitorias + 1
        WHERE UsuarioId = @vencedor;

        DECLARE @perdedor INT = 
            CASE 
                WHEN @vencedor = @jogador1 THEN @jogador2
                ELSE @jogador1
            END;

        IF @perdedor IS NOT NULL
            UPDATE Ranking
            SET Derrotas = Derrotas + 1
            WHERE UsuarioId = @perdedor;

        IF @contraIA = 1
        BEGIN
            UPDATE Ranking
            SET PartidasContraIA = PartidasContraIA + 1
            WHERE UsuarioId IN (@jogador1);
        END
        ELSE
        BEGIN
            UPDATE Ranking
            SET PartidasContraJogador = PartidasContraJogador + 1
            WHERE UsuarioId IN (@jogador1, @jogador2);
        END
    END
END;
GO

-- Usuários com senha já em SHA-256
INSERT INTO Usuarios (Nome, Email, SenhaHash)
VALUES 
('Alice', 'alice@email.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f'),
('Bob', 'bob@email.com', '6ca13d52ca70c883e0f0bb101e425a89e8624de51db2d2392593af6a84118090'),
('Carol', 'carol@email.com', '2b7d658ad3bff84a17aa643ed9332ef294d21f4cc832d270622fd72dd44e7ab2');

INSERT INTO Dificuldades (Nome, Descricao)
VALUES 
('Fácil', 'IA com jogadas aleatórias e simples'),
('Médio', 'IA com jogadas parcialmente estratégicas'),
('Difícil', 'IA com estratégia ótima de Nim');

-- Alice venceu contra IA (nível Médio)
INSERT INTO Partidas (Jogador1Id, ContraIA, DificuldadeId, VencedorId, DataFim)
VALUES (1, 1, 2, 1, GETDATE());

-- Bob vs Carol, Carol venceu
INSERT INTO Partidas (Jogador1Id, Jogador2Id, ContraIA, VencedorId, DataFim)
VALUES (2, 3, 0, 3, GETDATE());

-- Alice vs Bob, Bob venceu
INSERT INTO Partidas (Jogador1Id, Jogador2Id, ContraIA, VencedorId, DataFim)
VALUES (1, 2, 0, 2, GETDATE());

--select * from Usuarios
--select * from Partidas
--select * from Dificuldades
--select * from Ranking