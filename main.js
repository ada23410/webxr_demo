let currentScene = 'forest';

document.addEventListener('DOMContentLoaded', () => {
  const doorContainer = document.querySelector('#doorContainer');
  goToScene('forest');
  
  // 切換場景
  async function goToScene(preset) {
    doorContainer.innerHTML = '';
    currentScene = preset;
    const sky = document.querySelector('#sky'); 
  
    if (preset === 'forest') {
      sky.setAttribute('src', '#img-forest');
  
      buildDoors();
    } else {
      const res = await fetch('scenes.json');
      const scenes = await res.json();
      const sceneData = scenes.find(scene => scene.targetPreset === preset);
  
      if (sceneData && sceneData.skyImg) {
        sky.setAttribute('src', sceneData.skyImg);
      }
  
      if (sceneData) {
        buildSceneInfo(sceneData);   // 顯示標題／說明／影片
      }
  
      buildReturnDoor(); // 顯示返回鍵
    }
  }

  // 建立切換場景的門
  async function buildDoors() {
    // doorContainer.innerHTML = '';

    const res = await fetch('scenes.json');
    const doors = await res.json();

    console.log('載入門卡數量：', doors.length);
  
    //只建立 forest 場景中的門（排除 forest 本身）
    doors.forEach(door => {
      // 若這筆資料是某個 targetPreset 場景，就視為門卡
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

  // 返回default場景
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
  
  function buildSceneInfo(sceneData) {
    const infoCard = document.createElement('a-entity');
    infoCard.setAttribute('position', '-1.8 0.8 -3'); // 整體區塊位置
  
    // 背景板
    const background = document.createElement('a-rounded');
    background.setAttribute('width', 5.5);
    background.setAttribute('height', 2.5);
    background.setAttribute('color', 'black');
    background.setAttribute('opacity', 0.5);
    background.setAttribute('radius', 0.2);  
    background.setAttribute('position', '2.75 1.25 0');
    infoCard.appendChild(background);
  
    // 標題（左下角）
    const titleEl = document.createElement('a-text');
    titleEl.setAttribute('value', sceneData.title || '');
    titleEl.setAttribute('align', 'left');
    titleEl.setAttribute('color', 'white');
    titleEl.setAttribute('width', 4);
    titleEl.setAttribute('position', '0.2 2.0 0'); // 接近背景左上角
    infoCard.appendChild(titleEl);
  
    // 說明文字（對齊標題左邊）
    const descEl = document.createElement('a-text');
    descEl.setAttribute('value', sceneData.description || '');
    descEl.setAttribute('align', 'left');
    descEl.setAttribute('color', '#fff');
    descEl.setAttribute('width', 2.5);
    descEl.setAttribute('baseline', 'top'); // 讓文字從上方開始對齊
    descEl.setAttribute('line-height', 50); // 或自定義分段 + 多元素
    descEl.setAttribute('wrap-count', 35);
    descEl.setAttribute('position', '0.2 1.3 0'); // 接近左側往下
    infoCard.appendChild(descEl);
  
    // 影片（放在右側）
    const videoEl = document.createElement('a-video');
    videoEl.setAttribute('src', sceneData.video);
    videoEl.setAttribute('width', 2.5);
    videoEl.setAttribute('height', 1.5);
    videoEl.setAttribute('position', '4 1.2 0.01'); // 稍微往前避免被文字擋住
    videoEl.setAttribute('autoplay', true);
    videoEl.setAttribute('muted', true);
    videoEl.setAttribute('loop', true);
    infoCard.appendChild(videoEl);
  
    doorContainer.appendChild(infoCard);
  }  
});
