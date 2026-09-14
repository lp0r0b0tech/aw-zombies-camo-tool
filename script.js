// Original camo order (as discovered from AW Zombies Upgrade Station)
const ORIGINAL_CAMOS = [
    { id: 1, name: "Default (No Camo)", upgrade: "1-4" },
    { id: 2, name: "Multicam", upgrade: "5" },
    { id: 3, name: "Urban", upgrade: "7" },
    { id: 4, name: "Strand", upgrade: "10" },
    { id: 5, name: "Concrete", upgrade: "13" },
    { id: 6, name: "Nanotech", upgrade: "16" },
    { id: 7, name: "Creature", upgrade: "19" },
    { id: 8, name: "Vortex", upgrade: "22" }
];

let customCamos = [...ORIGINAL_CAMOS];
let draggedElement = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    renderOriginalList();
    renderCustomList();
    updateComparison();

    // Button event listeners
    document.getElementById('resetBtn').addEventListener('click', resetToOriginal);
    document.getElementById('exportBtn').addEventListener('click', exportCustomOrder);
    document.getElementById('importBtn').addEventListener('click', triggerFileInput);
    document.getElementById('fileInput').addEventListener('change', importCustomOrder);

    // Load saved custom order from localStorage
    loadFromLocalStorage();
});

/**
 * Render the original camo order (read-only)
 */
function renderOriginalList() {
    const listContainer = document.getElementById('originalList');
    listContainer.innerHTML = '';

    ORIGINAL_CAMOS.forEach((camo, index) => {
        const camoItem = createCamoItem(camo, index + 1, 'original');
        listContainer.appendChild(camoItem);
    });
}

/**
 * Render the custom camo order (draggable)
 */
function renderCustomList() {
    const listContainer = document.getElementById('customList');
    listContainer.innerHTML = '';

    if (customCamos.length === 0) {
        listContainer.innerHTML = '<div class="empty-state"><p>Drag camos here to start reordering</p></div>';
        return;
    }

    customCamos.forEach((camo, index) => {
        const camoItem = createCamoItem(camo, index + 1, 'custom');
        listContainer.appendChild(camoItem);
    });
}

/**
 * Create a camo item element
 */
function createCamoItem(camo, position, type) {
    const item = document.createElement('div');
    item.className = 'camo-item';
    item.draggable = type === 'original';
    item.dataset.camoId = camo.id;
    item.dataset.camoName = camo.name;

    if (type === 'original') {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragend', handleDragEnd);
    }

    item.innerHTML = `
        <div class="camo-number">#${position}</div>
        <div>
            <div class="camo-name">${camo.name}</div>
            <div class="camo-info">Upgrade Level: ${camo.upgrade}</div>
        </div>
        ${type === 'custom' ? `<button class="remove-btn" onclick="removeCamo(${camo.id})">Remove</button>` : ''}
    `;

    return item;
}

/**
 * Handle drag start
 */
function handleDragStart(event) {
    draggedElement = this;
    this.classList.add('dragging');
    event.dataTransfer.effectAllowed = 'copy';
    event.dataTransfer.setData('text/html', this.innerHTML);
}

/**
 * Handle drag end
 */
function handleDragEnd(event) {
    if (draggedElement) {
        draggedElement.classList.remove('dragging');
    }
    draggedElement = null;

    // Remove drag-over class from all items
    document.querySelectorAll('.camo-item').forEach(item => {
        item.classList.remove('drag-over');
    });
}

/**
 * Handle drag over (allow drop)
 */
function handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';

    const customList = document.getElementById('customList');
    customList.classList.add('drag-over');

    // Highlight the item being hovered
    const afterElement = getDragAfterElement(customList, event.clientY);
    if (afterElement == null) {
        customList.appendChild(draggedElement);
    } else {
        customList.insertBefore(draggedElement, afterElement);
    }
}

/**
 * Handle drop event
 */
function handleDrop(event) {
    event.preventDefault();
    event.stopPropagation();

    const customList = document.getElementById('customList');
    customList.classList.remove('drag-over');

    if (!draggedElement) return;

    const camoId = parseInt(draggedElement.dataset.camoId);
    const camoName = draggedElement.dataset.camoName;

    // Find the camo in the original list
    const camo = ORIGINAL_CAMOS.find(c => c.id === camoId);

    // Check if camo already exists in custom list
    if (!customCamos.find(c => c.id === camoId)) {
        customCamos.push(camo);
    }

    // Update the order based on current DOM
    updateCustomOrderFromDOM();
    renderCustomList();
    updateComparison();
    saveToLocalStorage();
}

/**
 * Get the element after which the dragged element should be inserted
 */
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.camo-item:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

/**
 * Update custom order based on current DOM order
 */
function updateCustomOrderFromDOM() {
    const customList = document.getElementById('customList');
    const items = customList.querySelectorAll('.camo-item');
    const newOrder = [];

    items.forEach(item => {
        const camoId = parseInt(item.dataset.camoId);
        const camo = ORIGINAL_CAMOS.find(c => c.id === camoId);
        if (camo) {
            newOrder.push(camo);
        }
    });

    customCamos = newOrder;
}

/**
 * Remove a camo from custom list
 */
function removeCamo(camoId) {
    customCamos = customCamos.filter(c => c.id !== camoId);
    renderCustomList();
    updateComparison();
    saveToLocalStorage();
}

/**
 * Reset to original order
 */
function resetToOriginal() {
    if (confirm('Are you sure you want to reset to the original order?')) {
        customCamos = [...ORIGINAL_CAMOS];
        renderCustomList();
        updateComparison();
        saveToLocalStorage();
    }
}

/**
 * Update comparison section
 */
function updateComparison() {
    const comparisonResult = document.getElementById('comparisonResult');
    let html = '';

    // Stats
    html += `
        <div class="comparison-stat">
            <div class="comparison-stat-label">Original Camos</div>
            <div class="comparison-stat-value">${ORIGINAL_CAMOS.length}</div>
        </div>
        <div class="comparison-stat">
            <div class="comparison-stat-label">Custom Camos Selected</div>
            <div class="comparison-stat-value">${customCamos.length}</div>
        </div>
        <div class="comparison-stat">
            <div class="comparison-stat-label">Camos Changed</div>
            <div class="comparison-stat-value">${getChangedCount()}</div>
        </div>
    `;

    // Changes list
    const changes = getChanges();
    if (changes.length > 0) {
        html += '<div class="changes-list"><h4>Position Changes:</h4>';
        changes.forEach(change => {
            const className = change.direction === 'up' ? 'moved-up' : 'moved-down';
            html += `<div class="change-item ${className}">
                ${change.name}: #${change.originalPos} → #${change.newPos}
            </div>`;
        });
        html += '</div>';
    } else if (customCamos.length > 0 && customCamos.length === ORIGINAL_CAMOS.length) {
        html += '<div class="changes-list"><h4>✓ Order is identical to original</h4></div>';
    }

    comparisonResult.innerHTML = html;
}

/**
 * Get count of changed positions
 */
function getChangedCount() {
    let count = 0;
    customCamos.forEach((camo, newIndex) => {
        const originalIndex = ORIGINAL_CAMOS.findIndex(c => c.id === camo.id);
        if (originalIndex !== newIndex) {
            count++;
        }
    });
    return count;
}

/**
 * Get list of changes
 */
function getChanges() {
    const changes = [];

    customCamos.forEach((camo, newIndex) => {
        const originalIndex = ORIGINAL_CAMOS.findIndex(c => c.id === camo.id);
        if (originalIndex !== newIndex) {
            changes.push({
                name: camo.name,
                originalPos: originalIndex + 1,
                newPos: newIndex + 1,
                direction: newIndex > originalIndex ? 'down' : 'up'
            });
        }
    });

    return changes.sort((a, b) => a.originalPos - b.originalPos);
}

/**
 * Export custom order as JSON
 */
function exportCustomOrder() {
    const data = {
        timestamp: new Date().toISOString(),
        originalCount: ORIGINAL_CAMOS.length,
        customOrder: customCamos,
        changes: getChanges()
    };

    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aw-zombies-camo-custom-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    alert('Custom order exported successfully!');
}

/**
 * Trigger file input for import
 */
function triggerFileInput() {
    document.getElementById('fileInput').click();
}

/**
 * Import custom order from JSON file
 */
function importCustomOrder(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (data.customOrder && Array.isArray(data.customOrder)) {
                customCamos = data.customOrder;
                renderCustomList();
                updateComparison();
                saveToLocalStorage();
                alert('Custom order imported successfully!');
            } else {
                alert('Invalid file format. Please use a file exported from this tool.');
            }
        } catch (error) {
            alert('Error reading file: ' + error.message);
        }
    };
    reader.readAsText(file);

    // Reset file input
    event.target.value = '';
}

/**
 * Save custom order to localStorage
 */
function saveToLocalStorage() {
    localStorage.setItem('customCamoOrder', JSON.stringify(customCamos));
}

/**
 * Load custom order from localStorage
 */
function loadFromLocalStorage() {
    const saved = localStorage.getItem('customCamoOrder');
    if (saved) {
        try {
            customCamos = JSON.parse(saved);
            renderCustomList();
            updateComparison();
        } catch (error) {
            console.error('Error loading from localStorage:', error);
        }
    }
}