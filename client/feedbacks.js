async function loadFeedbacks() {
    try {
        const response = await fetch('/api/feedback');
        const feedbacks = await response.json();
        
        const listDiv = document.getElementById('feedbackList');
        listDiv.innerHTML = ''; 

        if (!Array.isArray(feedbacks) || feedbacks.length === 0) {
            listDiv.innerHTML = '<h2 style="background:yellow; display:inline;">NO FEEDBACKS YET!</h2>';
            return;
        }

        feedbacks.forEach(fb => {
            const card = document.createElement('div');
            card.className = 'feedback-card';
            
            const starString = '⭐'.repeat(fb.rating || 0);

            const header = document.createElement('div');
            header.className = 'card-header';
            
            const h3 = document.createElement('h3');
            h3.textContent = `👤 ${fb.name}`;
            
            const ratingSpan = document.createElement('span');
            ratingSpan.className = 'rating';
            ratingSpan.textContent = starString;
            
            header.appendChild(h3);
            header.appendChild(ratingSpan);

            const commentP = document.createElement('p');
            commentP.className = 'comment-text';
            commentP.textContent = fb.comment;

            const dateSmall = document.createElement('small');
            dateSmall.className = 'date';
            dateSmall.textContent = `📅 ${fb.date ? new Date(fb.date).toLocaleDateString() : ''}`;

            const actionDiv = document.createElement('div');
            actionDiv.style.cssText = 'margin-top: 15px; display: flex; gap: 10px;';

            const editBtn = document.createElement('button');
            editBtn.textContent = '📝 EDIT';
            editBtn.style.cssText = 'background:#ccff00; color:#000; border:2px solid #000; font-family:inherit; padding:5px 10px; cursor:pointer; font-weight:bold;';
            editBtn.onclick = () => editFeedback(fb._id, fb.comment, fb.rating);

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '❌ DELETE';
            deleteBtn.style.cssText = 'background:#ff3366; color:#fff; border:2px solid #000; font-family:inherit; padding:5px 10px; cursor:pointer; font-weight:bold;';
            deleteBtn.onclick = () => deleteFeedback(fb._id);

            actionDiv.appendChild(editBtn);
            actionDiv.appendChild(deleteBtn);

            card.appendChild(header);
            card.appendChild(commentP);
            card.appendChild(dateSmall);
            card.appendChild(actionDiv);

            listDiv.appendChild(card);
        });
    } catch (err) {
        document.getElementById('feedbackList').innerHTML = '<h2>Failed to load data.</h2>';
    }
}

// Function to delete feedback
async function deleteFeedback(id) {
    if (confirm("Kya aap sach me ye feedback delete karna chahte hain?")) {
        try {
            const response = await fetch(`/api/feedback/${id}`, {
                method: 'DELETE'
            });
            const result = await response.json();
            alert(result.message || result.error || "Deleted");
            loadFeedbacks(); // Refresh current list
        } catch (err) {
            alert("Error deleting feedback");
        }
    }
}

// Function to edit feedback using standard browser prompts
async function editFeedback(id, oldComment, oldRating) {
    const newComment = prompt("write your new comment:", oldComment);
    if (newComment === null) return; // User cancelled

    const newRatingInput = prompt("give your new Rating(1 to 5):", oldRating);
    if (newRatingInput === null) return;
    
    const newRating = parseInt(newRatingInput);

    if (isNaN(newRating) || newRating < 1 || newRating > 5) {
        alert("Valid rating dalo (1, 2, 3, 4, ya 5)!");
        return;
    }

    try {
        const response = await fetch(`/api/feedback/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ comment: newComment, rating: newRating })
        });
        const result = await response.json();
        alert(result.message || result.error || "Feedback updated successfully!");
        loadFeedbacks(); // Refresh list to show edits
    } catch (err) {
        alert("Error updating feedback");
    }
}

// Function call on page load
loadFeedbacks();