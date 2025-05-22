let currentScene = 'forest';

document.addEventListener('DOMContentLoaded', () => {
  const doorContainer = document.querySelector('#doorContainer');
  buildForestDoors();

  async function goToScene(preset) {
    doorContainer.innerHTML = '';
    currentScene = preset;
    const sky = document.querySelector('#sky'); 
    if (preset === 'forest') {
      // 💡 明確指定 forest 的 sky
      sky.setAttribute('src', '#img-forest');
      buildForestDoors();
    } else {
      const res = await fetch('scenes.json');
      const scenes = await res.json();
      const sceneData = scenes.find(scene => scene.targetPreset === preset);
  
      if (sceneData && sceneData.skyImg) {
        sky.setAttribute('src', sceneData.skyImg);
      }
  
      buildReturnDoor();
    }
  }

  async function buildForestDoors() {
    doorContainer.innerHTML = '';
    const res = await fetch('scenes.json');
    const doors = await res.json();

    doors.forEach(door => {
      const doorEl = document.createElement('a-plane');
      doorEl.setAttribute('position', door.position);
      doorEl.setAttribute('color', door.color);
      doorEl.setAttribute('width', door.width);
      doorEl.setAttribute('height', door.height);
      doorEl.setAttribute('class', 'clickable');
      doorEl.setAttribute('material', `src: ${door.img}; shader: flat; transparent: true`);

      doorEl.addEventListener('click', () => {
        goToScene(door.targetPreset);
      });

      doorContainer.appendChild(doorEl);
    });
  }

  function buildReturnDoor() {
    const doorEl = document.createElement('a-plane');
    doorEl.setAttribute('position', '0 -1 -3');
    doorEl.setAttribute('width', 1.5);
    doorEl.setAttribute('height', 0.8);
    doorEl.setAttribute('class', 'clickable');

    // 使用紅色背景 + 白色文字
    doorEl.setAttribute('material', 'shader: flat; transparent: true; opacity: 0');

    // 加上文字
    doorEl.setAttribute('text', {
      value: 'Go back ⮕',
      align: 'center',
      color: 'white',
      width: 4,
      font: 'mozillavr',
      baseline: 'center',
      shader: 'msdf',
      anchor: 'center'
    });

    // 加上 hover 放大動畫（自動）
    doorEl.setAttribute('animation__hover', {
      property: 'scale',
      startEvents: 'mouseenter',
      dur: 200,
      to: '1.2 1.2 1.2'
    });
    doorEl.setAttribute('animation__unhover', {
      property: 'scale',
      startEvents: 'mouseleave',
      dur: 200,
      to: '1 1 1'
    });

    // 點擊事件
    doorEl.addEventListener('click', () => {
      goToScene('forest');
    });

    doorContainer.appendChild(doorEl);
  }
});
