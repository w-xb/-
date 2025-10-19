function markdownToHtml(markdown) {

  console.log('输入的markdown:', markdown); // 添加调试日志

  let html = markdown;
  
  // 1. 标题：# 标题1 → <h1>标题1</h1>
  html = html.replace(/^#{1} (.*?)$/gm, '<h1>$1</h1>'); // h1
  html = html.replace(/^#{2} (.*?)$/gm, '<h2>$1</h2>'); // h2
  html = html.replace(/^#{3} (.*?)$/gm, '<h3>$1</h3>'); // h3
  
  // 2. 无序列表：- 列表项 → <li>列表项</li>，并包裹<ul>
  html = html.replace(/^- (.*?)$/gm, '<li>$1</li>');

  // 处理列表块（将连续的<li>包裹成<ul>）
  html = html.replace(/^- (.*?)$/gm, '<li>$1</li>');
  html = html.replace(/((<li>.*?<\/li>)+)/gs, '<ul>$1</ul>');
  
  // 3. 加粗：**文本** → <strong>文本</strong>
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // 4. 代码块：```代码``` → <pre><code>代码</code></pre>
  html = html.replace(/```(.*?)```/gs, '<pre><code>$1</code></pre>');
  
  // 5. 换行处理（将\n替换为<br>，但不在块元素内换行）
  html = html.replace(/\n/g, '<br>');

  console.log('转换后的HTML:', html); // 添加调试日志

  return html;


}



const API_KEY = "app-55b3BLz4vubaUd7qoDoLUeok";
class EcoRestorationSystem {


    showLoading(show) {
      const loadingElement = document.getElementById('loading');
      const generateBtn = document.getElementById('generateBtn');
      const improveBtn = document.getElementById('improveBtn');

      if (loadingElement) {
          loadingElement.style.display = show ? 'block' : 'none';
      }
      if (generateBtn) {
          generateBtn.disabled = show;
      }
      if (improveBtn) {
          improveBtn.disabled = show;
      }
  }

  /**
   * 构造函数
   * 初始化系统实例和必要属性
   */
  constructor() {

      this.uploadedImage = null;  // 存储上传的图片
      this.currentPlan = null;    // 存储当前的恢复方案
      this.isGenerating = false;

      // 确保在DOM加载完成后初始化
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeEventListeners();
        });
      } else {
          this.initializeEventListeners();
      }
  }

  /**
   * 初始化所有事件监听器
   * 包括文件上传、按钮点击、窗口大小变化等
   */
  initializeEventListeners() {
      const uploadArea = document.getElementById('uploadArea');
      const imageInput = document.getElementById('imageInput');
      const generateBtn = document.getElementById('generateBtn');
      const improveBtn = document.getElementById('improveBtn');

      // 添加调试信息
      console.log('初始化事件监听器');
      console.log('uploadArea:', uploadArea);
      console.log('imageInput:', imageInput);

      // 检查元素是否存在
      if (!uploadArea || !imageInput) {
        console.error('找不到必要的元素');
        return;
      }

       // 上传区域点击事件
      uploadArea.addEventListener('click', (e) => {
        console.log('uploadArea被点击');
        if (e.target.tagName !== 'IMG') {
            imageInput.click();
        }
    });

        // 拖拽事件
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.processFile(files[0]);
            }
        });

        // 文件选择事件
        imageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.processFile(file);
            }
        });

        // 按钮事件
        if (generateBtn) {
            generateBtn.addEventListener('click', () => this.generatePlan());
        }
        if (improveBtn) {
            improveBtn.addEventListener('click', () => this.improvePlan());
        }

        // 窗口大小变化事件
        
}

  /**
   * 处理拖拽悬停事件
   * @param {Event} e - 拖拽事件对象
   */
  handleDragOver(e) {
      e.preventDefault();
      document.getElementById('uploadArea').classList.add('dragover');
  }

  /**
   * 处理拖拽离开事件
   * @param {Event} e - 拖拽事件对象
   */
  handleDragLeave(e) {
      e.preventDefault();
      document.getElementById('uploadArea').classList.remove('dragover');
  }

  /**
   * 处理文件拖放事件
   * @param {Event} e - 拖放事件对象
   */
  handleDrop(e) {
      e.preventDefault();
      document.getElementById('uploadArea').classList.remove('dragover');
      const files = e.dataTransfer.files;
      if (files.length > 0) {
          this.processFile(files[0]);
      }
  }

  /**
     * 处理上传的文件
     * @param {File} file - 上传的文件对象
     */
  processFile(file) {
    // 验证文件类型
    if (!file.type.startsWith('image/')) {
        alert('请上传图片文件！');
        return;
    }

    this.uploadedImage = file;
    const reader = new FileReader();
    reader.onload = (e) => {
        const preview = document.getElementById('imagePreview');
        if (preview) {
            preview.innerHTML = `
                <div class="image-preview-wrapper">
                    <img src="${e.target.result}" class="uploaded-image" alt="上传的图片">
                    <button class="remove-image" onclick="this.parentElement.remove()">×</button>
                </div>
            `;
        }
    };
    reader.onerror = (error) => {
        console.error('文件读取失败:', error);
        alert('图片读取失败，请重试');
    };
    reader.readAsDataURL(file);
}
async generatePlan() {
  if (this.isGenerating) return;
  
  const imageFile = document.getElementById("imageInput").files[0];
  const location = document.getElementById("location").value.trim();
  const analysisEl = document.getElementById('analysisContent');
  const planEl = document.getElementById('planContent');

  if (!imageFile) {
      alert("请先选择一张图片文件");
      return;
  }
  if (!location) {
      alert("请输入地理位置");
      return;
  }

 

  try {
      this.isGenerating = true;
      this.showLoading(true);
      analysisEl.textContent = "正在上传图片...";
      planEl.textContent = "";
      // 上传图片
      const uploadForm = new FormData();
      uploadForm.append("file", imageFile);
      const uploadResp = await fetch("https://api.dify.ai/v1/files/upload", {
          method: "POST",
          headers: {
              Authorization: `Bearer ${API_KEY}`,
          },
          body: uploadForm,
      });

      if (!uploadResp.ok) {
          throw new Error("图片上传失败");
      }

      const uploadData = await uploadResp.json();
      const upload_file_id = uploadData.id;
      analysisEl.textContent = "图片上传成功，正在生成分析结果...";

      // 发送分析请求
      const requestBody = {
          inputs: {
              location: location,
              damageimage: {
                  type: "image",
                  transfer_method: "local_file",
                  upload_file_id: upload_file_id,
              },
          },
          query: "请根据提供的图片和地理位置,生成生态相关分析和恢复方案,并以Markdown格式返回",
          response_mode: "streaming",
          conversation_id: "",
          user: "user_00",
          files: [{
              type: "image",
              transfer_method: "local_file",
              upload_file_id: upload_file_id,
              name: "damageimage",
          }],
      };

      const response = await fetch("https://api.dify.ai/v1/chat-messages", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${API_KEY}`,
          },
          body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
          throw new Error(`HTTP错误 ${response.status}`);
      }

// 处理流式响应（仅修改此部分）
const reader = response.body.getReader();
const decoder = new TextDecoder();
let analysisText = "";
let planText = "";
let currentSection = null; // 初始无章节，等待标记触发

while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split("\n");

    for (const line of lines) {
        if (line.trim() === "data: [DONE]") {
            reader.cancel();
            break;
        }
        if (!line.startsWith("data:")) continue;

        try {
            const data = JSON.parse(line.slice(5));
            if (data.answer) {
                console.log('原始数据:', data.answer);
                console.log('当前章节:', currentSection);

                // 检查章节标记并切割内容（核心修改）
                // 1. 处理"## 图片描述"标记
                if (data.answer.includes("## 生态背景分析")) {
                    // 分割标记前后内容，只保留标记后部分
                    const parts = data.answer.split("## 生态背景分析");
                    const contentAfterMarker = parts.slice(1).join("## 生态背景分析");
                    
                    currentSection = "analysis";
                    analysisText = contentAfterMarker; // 重置为标记后内容
                    analysisEl.innerHTML = markdownToHtml(analysisText);
                    continue;
                }

                // 2. 处理"## 生态恢复方案"标记
                if (data.answer.includes("## 生态恢复方案")) {
                    const parts = data.answer.split("## 生态恢复方案");
                    const contentAfterMarker = parts.slice(1).join("## 生态恢复方案");
                    
                    currentSection = "plan";
                    planText = contentAfterMarker; // 重置为标记后内容
                    planEl.innerHTML = markdownToHtml(planText);
                    continue;
                }

                // 3. 根据当前章节追加内容（仅在检测到标记后才开始累积）
                if (currentSection === "analysis") {
                    analysisText += data.answer;
                    analysisEl.innerHTML = markdownToHtml(analysisText);
                    console.log('分析文本累积:', analysisText);
                } else if (currentSection === "plan") {
                    planText += data.answer;
                    planEl.innerHTML = markdownToHtml(planText);
                    console.log('方案文本累积:', planText);
                }
            }
        } catch (e) {
            console.warn("解析失败行：", line);
        }
    }
}

      // 保存当前方案
      this.currentPlan = {
          analysis: analysisText,
          plan: planText,
          location: location
      };

      

  } catch (error) {
      analysisEl.textContent = `错误：${error.message}`;
      console.error("请求失败：", error);
  } finally {
      this.isGenerating = false;
      this.showLoading(false);
  }
}


}


