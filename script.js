document.getElementById('breakButton').addEventListener('click', async () => {
  const contentArea = document.getElementById('contentArea');
  contentArea.innerHTML = 'Loading...';

  try {
    // Fetch both data files in parallel
    const [quotesRes, mediaRes] = await Promise.all([
      fetch('quotes.json'),
      fetch('data.json'),
    ]);

    if (!quotesRes.ok || !mediaRes.ok) {
      throw new Error('Failed to fetch data.');
    }

    const quotes = await quotesRes.json();
    const media = await mediaRes.json();

    // Randomly choose what to show
    const typeOptions = ['quote', 'video', 'giphy'];
    const selectedType =
      typeOptions[Math.floor(Math.random() * typeOptions.length)];

    let htmlContent = '';

    if (selectedType === 'quote') {
      const quote = quotes[Math.floor(Math.random() * quotes.length)];
      htmlContent = `
          <div class="quote-box">
            <p class="quote">💬 "${quote.quote}"</p>
            <p class="author">— ${quote.author}</p>
          </div>
        `;
    } else {
      const filteredMedia = media.filter(
        (item) => item.type === selectedType && item.url
      );
      const selected =
        filteredMedia[Math.floor(Math.random() * filteredMedia.length)];

      if (selectedType === 'video') {
        htmlContent = `
            <div class="video-container">
              <iframe width="560" height="315"
                src="${selected.url}?autoplay=1&mute=0"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen>
              </iframe>
            </div>
          `;
      } else if (selectedType === 'giphy') {
        htmlContent = `
            <div class="gif-container">
              <iframe src="${selected.url}" width="480" height="270" frameborder="0" allowfullscreen></iframe>
            </div>
          `;
      }
    }

    contentArea.innerHTML = htmlContent;
  } catch (error) {
    console.error('Error fetching break content:', error);
    contentArea.innerHTML = `
        <p style="color: red;">⚠️ Oops! Something went wrong. Please try again.</p>
      `;
  }
});
