const movieInput = document.getElementById("movieInput");
const suggestionsBox = document.getElementById("suggestions");

// Listen for typing
movieInput.addEventListener("keyup", async function () {
    const query = movieInput.value.trim();
    if (query.length === 0) {
        suggestionsBox.innerHTML = "";
        return;
    }

    try {
        const response = await fetch(`http://127.0.0.1:5000/search?q=${query}`);
        const data = await response.json();

        suggestionsBox.innerHTML = ""; // clear old

        data.matches.forEach(movie => {
            const div = document.createElement("div");
            div.className = "suggestion";
            div.textContent = movie;

            // On click, autofill + recommend
            div.onclick = () => {
                movieInput.value = movie;
                suggestionsBox.innerHTML = "";
                getRecommendations(); // trigger recommendation
            };

            suggestionsBox.appendChild(div);
        });
    } catch (error) {
        console.error("Error fetching suggestions:", error);
    }
});

async function getRecommendations() {
    try {
        const movie = movieInput.value.trim();

        const response = await fetch("http://127.0.0.1:5000/recommend", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ movie: movie })
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        const resultsDiv = document.getElementById("recommendations");
        resultsDiv.innerHTML = "";

        if (data.recommended_movies) {
            data.recommended_movies.forEach(movie => {
                const p = document.createElement("p");
                p.textContent = movie;
                resultsDiv.appendChild(p);
            });
        } else {
            resultsDiv.innerHTML = `<p style="color:red;">${data.error}</p>`;
        }
    } catch (error) {
        console.error("Error in getRecommendations:", error);
        const resultsDiv = document.getElementById("recommendations");
        resultsDiv.innerHTML = `<p style="color:red;">Error fetching recommendations.</p>`;
    }
}
