// Initialisiere Fabric.js Canvas
const canvas = new fabric.Canvas('productCanvas');

// Funktion: Bild hochladen
document.getElementById('uploadImage').addEventListener('change', function (e) {
    const reader = new FileReader();
    reader.onload = function (event) {
        const imgObj = new Image();
        imgObj.src = event.target.result;
        imgObj.onload = function () {
            const img = new fabric.Image(imgObj);
            img.scaleToWidth(200); // Passe die Größe an
            canvas.add(img);
        };
    };
    reader.readAsDataURL(e.target.files[0]);
});

let selectedText = null; // Speichert das aktuell ausgewählte Textobjekt

// Ereignis: Text hinzufügen
document.getElementById('addText').addEventListener('click', function () {
    const text = new fabric.Text('Dein Text', {
        left: 100,
        top: 100,
        fill: 'black',
        fontSize: 20,
        fontFamily: 'Arial',
    });
    canvas.add(text);
    canvas.setActiveObject(text); // Automatische Auswahl des neuen Textes
});

// Ereignis: Textfarbe ändern
document.getElementById('textColor').addEventListener('input', function (e) {
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'text') {
        activeObject.set('fill', e.target.value);
        canvas.renderAll();
    }
});

// Ereignis: Schriftart ändern
document.getElementById('fontFamily').addEventListener('change', function (e) {
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
document.getElementById('bold').addEventListener('click', function () {
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'text') {
        activeObject.set('fontWeight', activeObject.fontWeight === 'bold' ? 'normal' : 'bold');
        canvas.renderAll();
    }
});

// Textstil: Kursiv
document.getElementById('italic').addEventListener('click', function () {
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'text') {
        activeObject.set('fontStyle', activeObject.fontStyle === 'italic' ? 'normal' : 'italic');
        canvas.renderAll();
    }
});

// Textstil: Unterstrichen
document.getElementById('underline').addEventListener('click', function () {
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'text') {
        activeObject.set('underline', !activeObject.underline);
        canvas.renderAll();
    }
});

// Text löschen
document.getElementById('deleteText').addEventListener('click', function () {
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'text') {
        canvas.remove(activeObject);
        canvas.renderAll();
    }
});

// Ereignis: Textinhalt bearbeiten
document.getElementById('editText').addEventListener('input', function (e) {
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
    document.getElementById('editText').value = '';
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
