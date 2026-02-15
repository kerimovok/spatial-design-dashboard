export const storage = {
	has(key: string): boolean {
		try {
			return localStorage.getItem(key) !== null
		} catch {
			return false
		}
	},
	get<T>(key: string, fallback: T): T {
		try {
			const raw = localStorage.getItem(key)
			if (!raw) {
				return fallback
			}
			return JSON.parse(raw) as T
		} catch {
			return fallback
		}
	},
	set<T>(key: string, value: T): void {
		try {
			localStorage.setItem(key, JSON.stringify(value))
		} catch {
			// Swallow storage errors to keep UI responsive.
		}
	},
	remove(key: string): void {
		try {
			localStorage.removeItem(key)
		} catch {
			// Swallow storage errors to keep UI responsive.
		}
	},
}
