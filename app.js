
function infiniteScrollImages() {
    const errorMessage = document.getElementById('error-message');
    function errorMessageDisplayer(message) {
        errorMessage.classList.remove('hidden');
        errorMessage.textContent = message;
    }

    let currentImgIndex = 1;
    const imagesContainer = document.getElementById('images-container');
    function imagesDisplayer(datasToDisplay) {
        // if(lastImage){
        //     console.log('if lastimage', lastImage
        //     )
        //     observer.disconnect();
        //     observerOptions.root = lastImage;
        // }
        for (let i = 0; i < datasToDisplay.length; i++) {
            const img = document.createElement('img');
            img.src = datasToDisplay[i].urls.regular;
            img.dataset.index = currentImgIndex;
            currentImgIndex++;
            imagesContainer.appendChild(img);
        };
    };

    const loadingMessage = document.getElementById('loading');
    let currentPage = 1;
    let topic = "random";


    function imagesFetcher() {
        loadingMessage.classList.remove('hidden');

        fetch(`https://api.unsplash.com/search/photos?page=${currentPage}&query=${topic}>`, {
            headers: {
                Authorization: `Client-ID ${token}`
            }
        })
            .then(response => response.json())
            .then(datas => {
                loadingMessage.classList.add('hidden');
                if (datas.results.length > 0) {
                    imagesDisplayer(datas.results);
                    currentPage++;
                    console.log("page", currentPage, ": ", datas.results)
                } else {
                    errorMessageDisplayer("You have reach the end for today")
                }

            })
            .catch(error => {
                console.error(error);
                loadingMessage.classList.add('hidden');
                errorMessageDisplayer("Oh, it seems there is a Network problem...");
            });
    }

    // Define observer options
    let observerOptions = {
        root: null, // The viewport is the root by default
        rootMargin: "0px", // No margin around the observed target
        threshold: 0.1, // 1 means the callback will fire when 100% of the target is visible
    };

    // Create an Intersection Observer with the options
    const observer = new IntersectionObserver(
        (entries) => {
            // console.log(entries[0].target)  ////<div id="loading">Loading...</div>
            entries.forEach((entry) => {
                // console.log(entry.target) ////<div id="loading">Loading...</div>
                if (entry && entry.isIntersecting) {
                    imagesFetcher(); // Call your function to load more items or images
                }
            });
        },
        observerOptions);

    // Start observing the loadingMessage
    observer.observe(loadingMessage);


    function containerCleaner(container) {
        while (container.firstChild) {
            container.firstChild.remove();
        }
    }

    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            containerCleaner(imagesContainer);
            topic = searchInput.value;
            imagesFetcher();
        }
    });
}

let token;
(function tokenFetcher() {
    fetch('./token.json')
        .then((response) => response.json())
        .then((data) => {
            if (data.token) {
                token = data.token;
                console.log(token);
                infiniteScrollImages()
            } else {
                alert("Le token d'authentification n'a pas pu être récupéré correctement");
            }
        })
        .catch((error) => {
            console.log(error);
            alert("Le token d'authentification n'a pas pu être récupéré correctement");
        })
})();