async function loadFeedbacks() {
    try {
        const response = await fetch('/api/feedback');
        const feedbacks = await response.json();
        
        const listDiv = document.getElementById('feedbackList');
        listDiv.innerHTML = ''; 

        if (feedbacks.length === 0) {
            listDiv.innerHTML = '<h2 style="background:yellow; display:inline;">NO FEEDBACKS YET!</h2>';
            return;
        }

        feedbacks.forEach(fb => {
            const card = document.createElement('div');
            card.className = 'feedback-card';
            
            const starString = '⭐'.repeat(fb.rating);

            card.innerHTML = `
                <div class="card-header">
                    <h3>👤 ${fb.name}</h3>
                    <span class="rating">${starString}</span>
                </div>
                <p class="comment-text">${fb.comment}</p>
                <small class="date">📅 ${new Date(fb.date).toLocaleDateString()}</small>
            `;
            listDiv.appendChild(card);
        });
    } catch (err) {
        document.getElementById('feedbackList').innerHTML = '<h2>Failed to load data.</h2>';
    }
}

// Function call on page load
loadFeedbacks();