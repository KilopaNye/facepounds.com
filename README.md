# facepounds.com
FacePounds 甜點面交商議平台，提供給使用者更具流程化的面交商議過程，並且透過獨特的商議環節，提高整體交易彈性，並提供身分驗證功能，讓購買行程更安全。

#### **專案網址: https://facepounds.com**

### **專案架構**
![GITHUB](/public/images/image/layout.jpg)

#### **視訊流建立流程**
* **使用`peer.js`簡化`webRTC`底層複雜邏輯，減少開發的時間成本。**  
####
  1. 客戶端進入頁面後，產生一組新的`**peer_id**`。  
  2. 透過`**socket.io**`交換彼此`**peer_id**`。  
  3. 客戶端之間取得對方id後建立`p2p連線`，開啟穩定視訊流交換，並將取得的stream資料渲染至頁面，達成及時視訊效果。  
![GITHUB](/public/images/image/PEER.png)

### **功能說明：**