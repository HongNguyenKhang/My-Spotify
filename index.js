let accessToken
document.addEventListener("DOMContentLoaded", function(){
    initialApp();
})

async function initialApp() {
    accessToken = await getSpotifyToken();
    if(accessToken){
        const response = await getPopularTrack();
        displayTrack(response.tracks.items);
    }
}

function displayTrack(data) {
    console.log(data);
    data.forEach((item) => {
        // console.log(item)
        const imageUrl = item.album.images[0].url;
        const name = item.name;
        const artistName = item.artists.map((item) => item.name).join(" & ");
        console.log(artistName);

        // Tạo ra thẻ div
        const element = document.createElement("div");
        // Gắn class cho thẻ div
        element.className = "track-card";
        // Gắn nội dung cho thẻ div
        element.innerHTML = `<div class="track-card-container">
                                <img src="${imageUrl}" alt="">
                                <h3>${name}</h3>
                                <p>${artistName}</p>
                            </div>`;
        // Gắn thẻ div đó vào track-section
        const trackSection = document.getElementById("track-section");
        trackSection.appendChild(element);
    });
    

}

async function getPopularTrack() {
    try {
        const response = await axios.get("https://api.spotify.com/v1/search",{
            headers:{
                Authorization: `Bearer ${accessToken}`,
            },
            params:{
                q:"Keshi",
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