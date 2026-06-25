document.getElementById('feedbackForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const data = {
        name: document.getElementById('name').value,
        rating: document.getElementById('rating').value,
        comment: document.getElementById('comment').value
    };

    try {
        const response = await fetch('/api/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        
        document.getElementById('statusMsg').innerHTML = `✅ <span style="background:#ccff00; padding:2px;">${result.message}</span>`;
        document.getElementById('feedbackForm').reset();
    } catch (err) {
        document.getElementById('statusMsg').innerText = '❌ Error submitting feedback.';
    }
});