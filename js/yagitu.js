window.onload = function(){
document.querySelector("#Pertanyaan").addEventListener("submit", function(event) {
    event.preventDefault();
  
    var answer = document.querySelector('input[name="answer"]:checked').value;
  
    if (answer == "engga" || answer == "jelek") {
      alert("Yodah GPP, Tapi Hadiahnya Ini Aja, KLIK OK CIH");
      window.location.replace("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    } else {
      alert("Makasih, Sebagai Hadiah Terima Kasih, Klik OK akan kuberi hadiah");
      window.location.replace("https://pastebin.com/raw/CRDK4fER");
      
    }
  });
}