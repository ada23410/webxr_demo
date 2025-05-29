let currentScene = 'forest';

document.addEventListener('DOMContentLoaded', () => {
  const assets = document.querySelector('a-assets');
  const doorContainer = document.querySelector('#doorContainer');
  assets.addEventListener('loaded', () => {
    console.log('所有資源已載入，開始建立門卡！');
    goToScene('forest');
  });
  
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
        const doorEl = document.createElement('a-entity');
        doorEl.setAttribute('gltf-model', door.model);
        doorEl.setAttribute('position', door.position);
        doorEl.setAttribute('rotation', door.rotation || '90 0 0');
        doorEl.setAttribute('scale', door.scale || '0.1 0.1 0.1');
        doorEl.setAttribute('material', 'color: white; metalness: 0.3; roughness: 0.8');
        doorEl.setAttribute('class', 'clickable');
  
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
    infoCard.setAttribute('position', '-1.8 0.8 -3');
  
    // 背景板
    const background = document.createElement('a-plane');
    background.setAttribute('src', '#info-bg');
    background.setAttribute('width', 8);
    background.setAttribute('height', 3);
    background.setAttribute('position', '1.8 1.3 -0.01'); 
    background.setAttribute('opacity', '0.5'); 
    background.setAttribute('material', 'transparent: true'); 
    infoCard.appendChild(background);
  
    // 標題
    const titleEl = document.createElement('a-troika-text');
    titleEl.setAttribute('value', sceneData.title || '');
    titleEl.setAttribute('color', 'white');
    titleEl.setAttribute('fontSize', '0.42');
    titleEl.setAttribute('font', 'assets/fonts/NotoSansTC-Bold.ttf'); // 使用粗體版本
    titleEl.setAttribute('maxWidth', '3');
    titleEl.setAttribute('align', 'center');
    titleEl.setAttribute('position', '-0.4 2.1 0.01');
    infoCard.appendChild(titleEl);

  
    // 說明
    const descEl = document.createElement('a-troika-text');
    descEl.setAttribute('value', sceneData.description || '');
    descEl.setAttribute('color', '#fff');
    descEl.setAttribute('fontSize', '0.1');
    descEl.setAttribute('font', 'assets/fonts/NotoSansTC-Regular.ttf'); // 普通版本
    descEl.setAttribute('maxWidth', '2.8');
    descEl.setAttribute('lineHeight', '1.4');
    descEl.setAttribute('align', 'left');
    descEl.setAttribute('whiteSpace', 'normal');
    descEl.setAttribute('overflowWrap', 'break-word');
    descEl.setAttribute('position', '0.4 1.2 0.01');
    infoCard.appendChild(descEl);
  
    // 影片元件
    const videoEl = document.createElement('a-video');
    videoEl.setAttribute('src', sceneData.video); // '#vid-colosseum'
    videoEl.setAttribute('width', 2.5);
    videoEl.setAttribute('height', 1.5);
    videoEl.setAttribute('position', '4 1.2 0.01');
    videoEl.setAttribute('autoplay', false);
    videoEl.setAttribute('muted', true);
    videoEl.setAttribute('loop', true);
    videoEl.setAttribute('id', 'info-video');
    videoEl.setAttribute('playsinline', true);
    videoEl.setAttribute('class', 'clickable');
    infoCard.appendChild(videoEl);
  
    // 播放按鈕
    const playBtn = document.createElement('a-circle');
    playBtn.setAttribute('radius', 0.35);
    playBtn.setAttribute('color', '#222');
    playBtn.setAttribute('opacity', '0.7');
    playBtn.setAttribute('position', '4 1.2 0.02');
    playBtn.setAttribute('class', 'clickable');
  
    const playText = document.createElement('a-text');
    playText.setAttribute('value', 'play');
    playText.setAttribute('align', 'center');
    playText.setAttribute('color', 'white');
    playText.setAttribute('width', 1.5);
    playText.setAttribute('position', '0 0 0.01');
    playBtn.appendChild(playText);
  
    // 點擊播放
    playBtn.addEventListener('click', () => {
      const nativeVideo = document.querySelector(sceneData.video);
      if (nativeVideo) {
        nativeVideo.play().then(() => {
          playBtn.setAttribute('visible', 'false');
        }).catch(err => {
          console.warn('播放失敗：', err);
        });
      }
    });
  
    infoCard.appendChild(playBtn);
    doorContainer.appendChild(infoCard);
  
    // 進入/離開影片播放控制
    setTimeout(() => {
      const nativeVideo = document.querySelector(sceneData.video);
      if (!nativeVideo) return;
  
      videoEl.addEventListener('mouseenter', () => nativeVideo.play());
      videoEl.addEventListener('mouseleave', () => nativeVideo.pause());
    }, 500);
  }  
});
