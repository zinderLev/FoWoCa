// Интерфейс для данных, отправляемых на сервер
interface UserRegistrationData {
    username: string;
    password: string;
}

// Интерфейс для ответа от сервера
interface ServerResponse {
    message: string;
    success?: boolean; // Опциональное поле, если сервер его отправляет
}

document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registrationForm') as HTMLFormElement;
    const usernameInput = document.getElementById('username') as HTMLInputElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;

    if (registrationForm && usernameInput && passwordInput) {
        registrationForm.addEventListener('submit', async (event: Event) => {
            event.preventDefault(); // Предотвращаем стандартную отправку формы

            const username = usernameInput.value;
            const password = passwordInput.value;

            if (!username || !password) {
                alert('Пожалуйста, введите имя пользователя и пароль.');
                return;
            }

            const userData: UserRegistrationData = { username, password };

            try {
                const response = await fetch('/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userData),
                });

                const result: ServerResponse = await response.json();

                if (response.ok) { // Статус 2xx
                    alert(`Успех: ${result.message}`);
                    // Очистить поля формы после успешной регистрации
                    usernameInput.value = '';
                    passwordInput.value = '';
                } else { // Статус 4xx, 5xx
                    alert(`Ошибка: ${result.message}`);
                }
            } catch (error) {
                console.error('Ошибка при отправке запроса:', error);
                alert('Произошла ошибка сети или сервера. Попробуйте еще раз.');
            }
        });
    } else {
        console.error('Не удалось найти необходимые элементы формы в DOM.');
    }
});
