# 🍪FacePounds | 甜點面交商議平台
<h4>FacePounds，提供給使用者更具流程化的面交商議過程，並且透過獨特的商議環節，提高整體交易彈性，並提供身分驗證功能，讓購買行程更安全。  <h4>

## 目錄：

- [🍪專案架構](#專案架構)
- [🍪技術應用](#技術應用)
- [🍪資料庫設計](#資料庫設計)
- [🍪視訊流建立流程](#視訊流建立流程)
- [🍪身分驗證流程](#身分驗證流程)
- [🍪功能說明](#功能說明)
- [🍪Contact](#contact)

## 🍪專案架構：
![GITHUB](/public/images/image/layout.jpg)

## 🍪技術應用：
- 後端：
  - Python
      - Flask
  - socket.io
  - peer.js
  - pytest

- 雲端(AWS、Google cloud)：
    - AWS EC2
    - AWS S3 &  Cloudfront
    - GCP Cloud Vision API

- 部屬：
    - Docker
    - Ubuntu

- 資料庫：
    - MySQL (RDS)

- 連線：
    - HTTPS
    - Nginx
    - JWT token

- 前端：
    - JavaScript
    - HTML/CSS/SCSS
    - Sweetalert.js

- 開發工具：
    - Git & GitHub

***
### 🍪資料庫設計：
- 透過在常被搜尋的欄位上建立索引，加速資料搜索速度。並建立外鍵約束確保資料一致性。  
- 產品標籤與產品之間的連結，採用建立第三關連資料表的方式進行資料映射。參見  表 (product_tag_relation)
![GITHUB](/public/images/demo/SQL.png)

***
### 🍪視訊流建立流程：
* **使用`peer.js`簡化`webRTC`底層複雜邏輯，減少開發的時間成本。**  
####
  1. 客戶端進入頁面後，產生一組新的`peer_id`。  
  2. 透過`socket.io`交換彼此`peer_id`。  
  3. 客戶端之間取得對方id後建立`p2p連線`，開啟穩定視訊流交換，並將取得的stream資料渲染至頁面，達成即時視訊效果。  
![GITHUB](/public/images/image/PEER.png)
***
### 🍪身分驗證流程：
* 當選取圖片後，向後端發送檔案，並由伺服器向google cloud vision發出請求，當google cloud vision回傳字串陣列後，藉由python正規表達式篩選取得身分證字串，並使用身分證核對和公式進行合法性驗證，最後回傳結果用以更新資料庫會員狀態更新與前端資料回傳。
![GITHUB](/public/images/demo/cloudVision.png)
***
### 🍪功能說明：
* 於首頁點選產品，進入產品頁面後，可於右側查看商品資訊，並且進行`訂單下訂`的動作。

![GITHUB](/public/images/demo/首頁DEMO.gif)
***
* 進到商議畫面後，測試畫面左方為買家，右方為賣家。 買家可做訂單`項目確認`，賣家可做`資料更改`，並且同步雙方更新或確認後的渲染狀態。
* 完成所有確認後即顯示確認訂單，雙方都確認後該筆訂單即正式成立，進入待交易清單中。

![GITHUB](/public/images/demo/按鈕demo.gif)
***
* 進入訂單協商頁面後，使用`即時聊天協商`的功能與買賣雙方溝通，確認交易內容是否需要更改。

![GITHUB](/public/images/demo/聊天DEMO.gif)
***
* 點選左下角視訊icon，當雙方進入直播室後，建立peer_id ，透過socket.io交換id後建立視訊流交換通道，達成視訊功能。  

![GITHUB](/public/images/demo/視訊demo.gif)
***
* 自訂義的產品上傳頁面，上傳成功後顯示於首頁產品項目中。

![GITHUB](/public/images/demo/上傳DEMO.gif)
***
* 可於會員頁面查看上架產品與更改個人資料，右上角顯示是否已驗證。
* 上傳合法身分證件通過驗證機制後，右上角即顯示為已驗證圖標。

![GITHUB](/public/images/demo/個人資料及驗證DEMO.gif)


# 🍪Contact

🐈 吳伯韋 Bo-Wei, Wu  
email： steve69988@gmail.com  
Linkedin：https://www.linkedin.com/in/kilopanye/
