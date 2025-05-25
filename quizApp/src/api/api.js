const API_URL = 'http://localhost:3001/user/quizdb/quizzes';

export const fetchTestById = async (_id) => {
	try {
		const response = await fetch(`${API_URL}/${_id}`);
		if (!response.ok) {
			throw new Error("Тест не найден");
		}
		return await response.json();
	} catch (error) {
		console.error("Ошибка при загрузке теста:", error);
		throw error;
	}
};

export const submitTestResults = async (_id, results) => {
	try {
		const response = await fetch(`${API_URL}/${_id}/results`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(results),
		});
		return await response.json();
	} catch (error) {
		console.error("Ошибка при отправке результатов:", error);
		throw error;
	}
};