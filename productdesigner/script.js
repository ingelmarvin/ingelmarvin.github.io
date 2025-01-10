// Initialisiere Fabric.js Canvas
const canvas = new fabric.Canvas('productCanvas');
let selectedText = null;

//löschlogik
const deleteIcon =
    "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";

var deleteImg = document.createElement('img');
deleteImg.src = deleteIcon;

fabric.Object.prototype.transparentCorners = false;
fabric.Object.prototype.cornerColor = 'blue';
fabric.Object.prototype.cornerStyle = 'circle';

function addObjectToCanvas(addedObject) {

    addedObject.controls.deleteControl = new fabric.Control({
        x: 0.5,
        y: -0.5,
        offsetX: 16,
        offsetY: -16,
        cursorStyle: 'pointer',
        mouseUpHandler: onDeleteObjectFromIconPressed,
        render: renderDeleteIcon(deleteImg),
        cornerSize: 24,
    });

    canvas.add(addedObject);
    canvas.setActiveObject(addedObject);
}

function onDeleteObjectFromIconPressed(_eventData, transform) {
    canvas.remove(transform.target);
    canvas.requestRenderAll();
}

function renderDeleteIcon(icon) {

    return function (ctx, left, top, _styleOverride, fabricObject) {
        const size = this.cornerSize;
        ctx.save();
        ctx.translate(left, top);
        ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
        ctx.drawImage(icon, -size / 2, -size / 2, size, size);
        ctx.restore();
    }
}

//Ereignis: Neuer Bildbutton geklickt
document.getElementById('addImg')?.addEventListener('click', () => {
    const uploadImageButton = document.createElement("input");
    uploadImageButton.type = "file";

    uploadImageButton.addEventListener('change', function (e) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const imgObj = new Image();
            imgObj.src = event.target.result;
            imgObj.onload = function () {
                const img = new fabric.Image(imgObj);
                img.scaleToWidth(200); // Passe die Größe an
                addObjectToCanvas(img);
            };
        };
        reader.readAsDataURL(e.target.files[0]);
    });

    document.body.appendChild(uploadImageButton);
    uploadImageButton.click();
    document.body.removeChild(uploadImageButton);

})

// Ereignis: Text hinzufügen
document.getElementById('addText')?.addEventListener('click', function () {
    const text = new fabric.Text('Dein Text', {
        left: 100,
        top: 100,
        fill: 'black',
        fontSize: 20,
        fontFamily: 'Arial',
        objectCaching: false,
    });
    addObjectToCanvas(text)
    //canvas.add(text);
    //    canvas.setActiveObject(text); // Automatische Auswahl des neuen Textes
});

// Ereignis: Textfarbe ändern
document.getElementById('textColor')?.addEventListener('input', function (e) {
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'text') {
        activeObject.set('fill', e.target.value);
        canvas.renderAll();
    }
});

// Ereignis: Schriftart ändern
document.getElementById('fontFamily')?.addEventListener('change', function (e) {
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'text') {
        activeObject.set('fontFamily', e.target.value);
        canvas.renderAll();
    }
});

// Ereignis: Objekte auswählen
canvas.on('selection:created', function (e) {
    const activeObject = e.target;
    if (activeObject && activeObject.type === 'text') {
        selectedText = activeObject;

        // Synchronisiere die Werte mit den aktuellen Einstellungen des Objekts
        document.getElementById('textColor').value = activeObject.fill || '#000000';
        document.getElementById('fontSize').value = activeObject.fontSize || 20;
        document.getElementById('fontFamily').value = activeObject.fontFamily || 'Arial';
    }
});

// Ereignis: Auswahl löschen
canvas.on('selection:cleared', function () {
    selectedText = null;
});

// Textstil: Fett
document.getElementById('bold')?.addEventListener('click', function () {
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'text') {
        activeObject.set('fontWeight', activeObject.fontWeight === 'bold' ? 'normal' : 'bold');
        canvas.renderAll();
    }
});

// Textstil: Kursiv
document.getElementById('italic')?.addEventListener('click', function () {
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'text') {
        activeObject.set('fontStyle', activeObject.fontStyle === 'italic' ? 'normal' : 'italic');
        canvas.renderAll();
    }
});

// Textstil: Unterstrichen
document.getElementById('underline')?.addEventListener('click', function () {
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'text') {
        activeObject.set('underline', !activeObject.underline);
        canvas.renderAll();
    }
});

// Text löschen
document.getElementById('deleteText')?.addEventListener('click', function () {
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'text') {
        canvas.remove(activeObject);
        canvas.renderAll();
    }
});

// Ereignis: Textinhalt bearbeiten
document.getElementById('editText')?.addEventListener('input', function (e) {
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'text') {
        activeObject.set('text', e.target.value); // Aktualisiere den Text
        canvas.renderAll();
    }
});

// Synchronisierung, wenn ein Textobjekt ausgewählt wird
canvas.on('selection:created', function (e) {
    const activeObject = e.target;
    if (activeObject && activeObject.type === 'text') {
        document.getElementById('editText').value = activeObject.text || '';
    }
});

// Zurücksetzen des Eingabefelds, wenn die Auswahl gelöscht wird
canvas.on('selection:cleared', function () {
    //document.getElementById('editText').value = '';
});

// Ereignis: Doppelklick für Textbearbeitung
canvas.on('mouse:dblclick', function (e) {
    const activeObject = e.target;

    if (activeObject && activeObject.type === 'text') {
        // Eingabefeld an der Position des Textobjekts anzeigen
        const input = document.createElement('input');
        input.type = 'text';
        input.value = activeObject.text || '';
        input.style.position = 'absolute';
        input.style.left = `${activeObject.left}px`;
        input.style.top = `${activeObject.top}px`;
        input.style.zIndex = 1000;
        input.style.fontSize = `${activeObject.fontSize}px`;
        input.style.fontFamily = activeObject.fontFamily;

        document.body.appendChild(input);
        input.focus();

        // Beim Drücken von Enter oder Verlassen des Feldes den Text aktualisieren
        input.addEventListener('blur', () => {
            activeObject.set('text', input.value);
            canvas.renderAll();
            document.body.removeChild(input); // Eingabefeld entfernen
        });

        input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                input.blur(); // Simuliert das Verlassen des Feldes
            }
        });
    }
});

let touchStartTime = 0; // Zeitstempel für den Touchstart

canvas.on('touchstart', function (e) {
    const activeObject = e.target;
    if (activeObject && activeObject.type === 'text') {
        // Wenn ein Textobjekt berührt wird, speichern wir die Zeit
        if (touchStartTime > 0 && new Date().getTime() - touchStartTime < 300) {
            // Wenn es innerhalb von 300ms erneut berührt wird, dann bearbeiten wir den Text
            editTextObject(activeObject);
        }
        touchStartTime = new Date().getTime(); // Setze Zeit für den nächsten Touch
    }
});

// Funktion für das Bearbeiten des Textes
function editTextObject(activeObject) {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = activeObject.text || '';
    input.style.position = 'absolute';
    input.style.left = `${activeObject.left}px`;
    input.style.top = `${activeObject.top}px`;
    input.style.zIndex = 1000;
    input.style.fontSize = `${activeObject.fontSize}px`;
    input.style.fontFamily = activeObject.fontFamily;
    input.style.width = `${activeObject.width}px`;

    document.body.appendChild(input);
    input.focus();

    // Beim Verlassen des Feldes oder Drücken von Enter den Text aktualisieren
    input.addEventListener('blur', () => {
        activeObject.set('text', input.value);
        canvas.renderAll();
        document.body.removeChild(input); // Eingabefeld entfernen
    });

    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            input.blur(); // Verliert den Fokus
        }
    });
}

function downloadCanvasImage() {
    const imageSrc = canvas.toDataURL();
    // some download code down here
    const a = document.createElement('a');
    a.href = imageSrc;
    a.download = 'image.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}