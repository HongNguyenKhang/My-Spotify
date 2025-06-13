let accessToken;
let searchTimeOut;
document.addEventListener("DOMContentLoaded", function(){
    initialApp();
    setupSearchListener();
});

function setupSearchListener() {
    const inputSearch = document.getElementById("input-search");
    inputSearch.addEventListener("input", (e) =>{

        const querry = e.target.value.trim();
        clearTimeout(searchTimeOut);
        //debounce
        searchTimeOut = setTimeout(async () => {
            if(querry) {
            const response = await getPopularTrack(querry);
            resetTrack();
            displayTrack(response.tracks.items)
            }
        },500);
        
    });
}

async function initialApp() {
    accessToken = await getSpotifyToken();
    if(accessToken){
        const response = await getPopularTrack();
        displayTrack(response.tracks.items);
    }
}

function resetTrack() {
    const trackSection = document.getElementById("track-section");
    trackSection.innerHTML = "";
}

function displayTrack(data) {
    data.forEach((item) => {
        // console.log(item.id);
        const imageUrl = item.album.images[0].url;
        const name = item.name;
        const artistName = item.artists.map((item) => item.name).join(" & ");
        // console.log(artistName);

        // Tạo ra thẻ div
        const element = document.createElement("div");
        // Gắn class cho thẻ div
        element.className = "track-card";
        // Gắn nội dung cho thẻ div
        element.innerHTML = `<div class="track-card-container">
                                <img src="${imageUrl}" alt="">
                                <h3>${name}</h3>
                                <p>${truncateText(artistName, 25)}</p>
                            </div>`;

        //Thêm event listner để phát nhạc
        element.addEventListener("click", () => {
            playTrack(item.id, name, artistName);
        });
        
        
        // Gắn thẻ div đó vào track-section
        const trackSection = document.getElementById("track-section");
        trackSection.appendChild(element);
    });
}

function truncateText(text, number) {
    return text.length > number ? text.slice(0, number) + "..." : text;
}

function playTrack(id, name, artistName) {
    const iframe = document.getElementById("iframe");
    iframe.src = `https://open.spotify.com/embed/track/${id}?utm_source=generator&theme=0`
    const modal = document.getElementById("modal");
    modal.style.display = "block";
    const modalName = document.getElementById("modal-name");
    modalName.innerHTML = name;
}

function handleClose() {
    const iframe = document.getElementById("iframe");
    const modal = document.getElementById("modal");
    modal.style.display = "none";
    iframe.src = "";
}

async function getPopularTrack(querry = "Thịnh Suy") {
    try {
        const response = await axios.get("https://api.spotify.com/v1/search",{
            headers:{
                Authorization: `Bearer ${accessToken}`,
            },
            params:{
                q:querry,
                type:"track",
                limit:"10",
            },
        });
        return response.data;
    }catch (error) {
        console.log(error);
    }
}

async function getSpotifyToken() {
    try {
        const credentials = btoa(
        `${SPOTIFY_CONFIG.CLIENT_ID}:${SPOTIFY_CONFIG.CLIENT_SECRET}`
        );
        const response = await axios.post(
        "https://accounts.spotify.com/api/token",
        "grant_type=client_credentials",
        {
            headers: {
            Authorization: `Basic ${credentials}`,
            "Content-Type": "application/x-www-form-urlencoded",
            },
        }
        );
        return response.data.access_token;
    } catch (error) {
        console.error("Error getting token:", error);
        return null;
    }
}