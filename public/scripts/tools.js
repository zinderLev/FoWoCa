"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureUsersDirectoryExists = ensureUsersDirectoryExists;
exports.userFileExists = userFileExists;
exports.createUserFile = createUserFile;
exports.readUserFile = readUserFile;
const fs = __importStar(require("fs/promises")); // Используем промисные версии fs
const path = __importStar(require("path"));
// Определяем путь к каталогу пользователей относительно корня проекта
const USERS_DIR = path.join(process.cwd(), 'users');
/**
 * Проверяет существование каталога пользователей и создает его, если он не существует.
 */
async function ensureUsersDirectoryExists() {
    try {
        await fs.mkdir(USERS_DIR, { recursive: true });
        console.log(`Users directory ensured at: ${USERS_DIR}`);
    }
    catch (error) {
        console.error(`Error ensuring users directory: ${error}`);
        throw new Error('Failed to ensure users directory exists.');
    }
}
/**
 * Проверяет, существует ли файл пользователя.
 * @param username Имя пользователя.
 * @returns true, если файл существует, иначе false.
 */
async function userFileExists(username) {
    const userFilePath = path.join(USERS_DIR, `${username}.json`);
    try {
        await fs.access(userFilePath); // Проверяем доступность файла
        return true;
    }
    catch (error) {
        if (error.code === 'ENOENT') { // Файл не найден
            return false;
        }
        console.error(`Error checking user file existence for ${username}: ${error}`);
        throw new Error('Failed to check user file existence.');
    }
}
/**
 * Создает новый файл пользователя с предоставленными данными.
 * @param userData Объект с данными пользователя (username, password).
 */
async function createUserFile(userData) {
    const userFilePath = path.join(USERS_DIR, `${userData.username}.json`);
    try {
        // В реальном приложении здесь нужно хешировать пароль перед сохранением
        await fs.writeFile(userFilePath, JSON.stringify(userData, null, 2), 'utf8');
        console.log(`User file created for ${userData.username} at ${userFilePath}`);
    }
    catch (error) {
        console.error(`Error creating user file for ${userData.username}: ${error}`);
        throw new Error('Failed to create user file.');
    }
}
/**
 * Читает данные пользователя из файла.
 * @param username Имя пользователя.
 * @returns Данные пользователя или null, если файл не найден.
 */
async function readUserFile(username) {
    const userFilePath = path.join(USERS_DIR, `${username}.json`);
    try {
        const data = await fs.readFile(userFilePath, 'utf8');
        return JSON.parse(data);
    }
    catch (error) {
        if (error.code === 'ENOENT') {
            return null; // Файл не найден
        }
        console.error(`Error reading user file for ${username}: ${error}`);
        throw new Error('Failed to read user file.');
    }
}
