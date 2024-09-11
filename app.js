const canvas = document.getElementById('memeCanvas');
const ctx = canvas.getContext('2d');
const imageUpload = document.getElementById('imageUpload');
const topTextInput = document.getElementById('topText');
const bottomTextInput = document.getElementById('bottomText');
const generateBtn = document.getElementById('generateBtn');
const downloadBtn = document.getElementById('downloadBtn');
const addTextBoxBtn = document.getElementById('addTextBoxBtn');
const additionalTextBoxes = document.getElementById('additionalTextBoxes');

let img = new Image();
let textBoxes = [];

// Handle image upload
imageUpload.addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        img.src = e.target.result;
    };
    
    reader.readAsDataURL(file);
});

// Handle image loading
img.onload = function() {
    const maxWidth = 800; // maximum width of the canvas
    const maxHeight = 600; // maximum height of the canvas

    let ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
    
    canvas.width = img.width * ratio;
    canvas.height = img.height * ratio;

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
};

// Function to wrap text within the canvas
function wrapText(ctx, text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = ctx.measureText(currentLine + ' ' + word).width;
        if (width < maxWidth) {
            currentLine += ' ' + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}

// Function to draw text on the canvas
function drawText(ctx, text, x, y, maxWidth) {
    let fontSize = Math.floor(canvas.width / 15); // Initial font size
    ctx.font = `${fontSize}px Impact`;

    // Adjust font size if the text is too wide
    while (ctx.measureText(text).width > maxWidth) {
        fontSize -= 2;
        ctx.font = `${fontSize}px Impact`;
    }

    const lines = wrapText(ctx, text, maxWidth);
    const lineHeight = fontSize * 1.2; // Line height for spacing

    lines.forEach((line, i) => {
        ctx.fillText(line, x, y + i * lineHeight);
        ctx.strokeText(line, x, y + i * lineHeight);
    });
}

// Handle meme generation
generateBtn.addEventListener('click', function() {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const topText = topTextInput.value;
    const bottomText = bottomTextInput.value;

    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.textAlign = 'left'; // Align text to the left edge

    const padding = 20; // Padding from edges
    const maxWidth = canvas.width - 2 * padding; // Width for text

    // Draw top text
    drawText(ctx, topText, padding, padding + 30, maxWidth);

    // Draw bottom text
    drawText(ctx, bottomText, padding, canvas.height - padding - 20, maxWidth);

    // Draw additional text boxes
    textBoxes.forEach(box => {
        ctx.font = '20px Arial';
        ctx.fillText(box.text, box.x, box.y);
        ctx.strokeText(box.text, box.x, box.y);
    });
});

// Handle meme download
downloadBtn.addEventListener('click', function() {
    const link = document.createElement('a');
    link.download = 'meme.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
});

// Handle adding additional text boxes
addTextBoxBtn.addEventListener('click', function() {
    const newTextBox = document.createElement('input');
    newTextBox.type = 'text';
    newTextBox.className = 'additionalTextBox';
    newTextBox.placeholder = 'Additional Text';
    newTextBox.addEventListener('input', function() {
        const text = this.value;
        const x = canvas.width / 2;
        const y = canvas.height / 2;
        textBoxes.push({ text, x, y });
    });
    additionalTextBoxes.appendChild(newTextBox);
});