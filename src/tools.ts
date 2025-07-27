import * as fs from 'fs/promises'; // Используем промисные версии fs
import * as path from 'path';

// Определяем путь к каталогу пользователей относительно корня проекта
const USERS_DIR = path.join(process.cwd(), 'users');

// Интерфейс для данных пользователя
export interface UserData {
  username: string;
  password: string; // В реальном приложении пароль нужно хешировать!
}

/**
 * Проверяет существование каталога пользователей и создает его, если он не существует.
 */
export async function ensureUsersDirectoryExists(): Promise<void> {
  try {
    await fs.mkdir(USERS_DIR, { recursive: true });
    console.log(`Users directory ensured at: ${USERS_DIR}`);
  } catch (error) {
    console.error(`Error ensuring users directory: ${error}`);
    throw new Error('Failed to ensure users directory exists.');
  }
}

/**
 * Проверяет, существует ли файл пользователя.
 * @param username Имя пользователя.
 * @returns true, если файл существует, иначе false.
 */
export async function userFileExists(username: string): Promise<boolean> {
  const userFilePath = path.join(USERS_DIR, `${username}.json`);
  try {
    await fs.access(userFilePath); // Проверяем доступность файла
    return true;
  } catch (error: any) {
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
export async function createUserFile(userData: UserData): Promise<void> {
  const userFilePath = path.join(USERS_DIR, `${userData.username}.json`);
  try {
    // В реальном приложении здесь нужно хешировать пароль перед сохранением
    await fs.writeFile(userFilePath, JSON.stringify(userData, null, 2), 'utf8');
    console.log(`User file created for ${userData.username} at ${userFilePath}`);
  } catch (error) {
    console.error(`Error creating user file for ${userData.username}: ${error}`);
    throw new Error('Failed to create user file.');
  }
}

/**
 * Читает данные пользователя из файла.
 * @param username Имя пользователя.
 * @returns Данные пользователя или null, если файл не найден.
 */
export async function readUserFile(username: string): Promise<UserData | null> {
  const userFilePath = path.join(USERS_DIR, `${username}.json`);
  try {
    const data = await fs.readFile(userFilePath, 'utf8');
    return JSON.parse(data) as UserData;
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return null; // Файл не найден
    }
    console.error(`Error reading user file for ${username}: ${error}`);
    throw new Error('Failed to read user file.');
  }
}
