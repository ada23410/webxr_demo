let currentScene = 'forest';

document.addEventListener('DOMContentLoaded', () => {
    const scene = document.querySelector('#mainScene');
    const doorContainer = document.querySelector('#doorContainer');
  
    // 初始化：先載入 forest 的所有門
    buildForestDoors();
  
    // 切換到其他場景
    function goToScene(preset) {
        doorContainer.innerHTML = ''; // 每次進場前都先清空
        scene.setAttribute('environment', `preset: ${preset}; shadow: true;`);

        currentScene = preset;

        if (preset === 'forest') {
            buildForestDoors();          // 只有 forest 有多門
        } else {
            buildReturnDoor();  
        }         // 其他場景只放返回門
    }

    // 返回 forest 場景
    backButton.addEventListener('click', () => {
        goToScene('forest');
    });
  
    // 只在 forest 顯示多個門（從 JSON 載入）
    async function buildForestDoors() {
      doorContainer.innerHTML = '';
      const res = await fetch('scenes.json');
      const doors = await res.json();
  
      doors.forEach(door => {
        const doorEl = document.createElement('a-plane');
        doorEl.setAttribute('position', door.position); // 位置
        doorEl.setAttribute('color', door.color);   // 顏色
        doorEl.setAttribute('width', 1.2);          // 尺寸
        doorEl.setAttribute('height', 0.8);
        doorEl.setAttribute('class', 'clickable');
  
        // 點擊 → 切換至指定場景
        doorEl.addEventListener('click', () => {
            goToScene(door.targetPreset);
        });
  
        doorContainer.appendChild(doorEl);
      });
    }
  
    // 在非 forest 場景只建立一個「返回門」
    function buildReturnDoor() {
        const doorEl = document.createElement('a-plane');
        doorEl.setAttribute('position', '0 1.5 -3');
        doorEl.setAttribute('color', '#FF6B6B');
        doorEl.setAttribute('width', 1.2);
        doorEl.setAttribute('height', 0.8);
        doorEl.setAttribute('class', 'clickable');
        doorEl.setAttribute('text', 'value: 回森林; align: center; width: 4; color: white');

        doorEl.addEventListener('click', () => {
            goToScene('forest');
        });

        doorContainer.appendChild(doorEl);
    }
});
