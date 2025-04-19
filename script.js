const imageInput = document.getElementById('imageInput');
const canvas = document.getElementById('imageCanvas');
const ctx = canvas.getContext('2d');
const neonEffectButton = document.getElementById('neonEffect');
const resetButton = document.getElementById('reset');
const gradientStartInput = document.getElementById('gradientStart');
const gradientEndInput = document.getElementById('gradientEnd');
const neonColorInput = document.getElementById('neonColor');
const applyGradientButton = document.getElementById('applyGradient');
const downloadButton = document.getElementById('downloadImage');
const removeBgApiButton = document.getElementById('removeBgApiButton');

let image = new Image();

imageInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            image.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

image.onload = () => {
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);
};

neonEffectButton.addEventListener('click', () => {
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 20;
    ctx.drawImage(image, 0, 0);
});

resetButton.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);
});

applyGradientButton.addEventListener('click', () => {
    const gradientStart = gradientStartInput.value || '#00ffff';
    const gradientEnd = gradientEndInput.value || '#0000ff';

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, gradientStart);
    gradient.addColorStop(1, gradientEnd);

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Efface le canvas avant d'appliquer le dégradé
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Ajout d'un effet d'ombre après l'application du dégradé
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 30;
    ctx.drawImage(image, 0, 0);
});

neonColorInput.addEventListener('input', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.shadowColor = neonColorInput.value || '#00ffff';
    ctx.shadowBlur = 20;
    ctx.drawImage(image, 0, 0);
});

downloadButton.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'image_modifiee.png';
    link.href = canvas.toDataURL();
    link.click();
});

removeBgApiButton.addEventListener('click', async () => {
    if (!image.src) {
        alert('Veuillez d\u00e9finir une image avant de continuer.');
        return;
    }

    const formData = new FormData();
    formData.append('image_file', await fetch(image.src).then(res => res.blob()));
    formData.append('size', 'auto');

    try {
        const response = await fetch('https://api.remove.bg/v1.0/removebg', {
            method: 'POST',
            headers: {
                'X-Api-Key': '1ZCjZmnzRVH6376GKbeGfqLn'
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error('Erreur lors du traitement de l\u0027image.');
        }

        const resultBlob = await response.blob();
        const resultUrl = URL.createObjectURL(resultBlob);

        const img = new Image();
        img.src = resultUrl;
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            image.src = resultUrl; // Met à jour la source de l'image pour les prochaines modifications
        };
    } catch (error) {
        console.error(error);
        alert('Une erreur est survenue lors du d\u00e9tourage de l\u0027image.');
    }
});