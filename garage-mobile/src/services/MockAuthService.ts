import { reactive } from 'vue';

const savedUser = localStorage.getItem('user');
export const authState = reactive({
    isAuthenticated: !!savedUser,
    user: savedUser ? JSON.parse(savedUser) : null,
});

export const AuthService = {
    login(email: string, password: string) {
        // Simuler une connexion réussie avec délai
        return new Promise<boolean>((resolve) => {
            setTimeout(() => {
                if (email && password) {
                    authState.isAuthenticated = true;
                    authState.user = { email, name: 'Client Test' };
                    localStorage.setItem('user', JSON.stringify(authState.user));
                    resolve(true);
                } else {
                    resolve(false);
                }
            }, 1000); // 1s de délai artificiel pour l'effet "Vraie App"
        });
    },
    register(data: any) {
        // Simuler une inscription réussie
        return new Promise<boolean>((resolve) => {
            setTimeout(() => resolve(true), 1000);
        });
    },
    logout() {
        authState.isAuthenticated = false;
        authState.user = null;
        localStorage.removeItem('user');
    },
    isAuthenticated() {
        return authState.isAuthenticated;
    }
};
