const preloaderStyles = `
  #initial-loader {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    transition: opacity 0.3s ease-out;
  }
  #initial-loader.hide {
    opacity: 0;
    pointer-events: none;
  }
  .initial-loader-spinner {
    width: 48px;
    height: 48px;
    border: 4px solid #e0e0e0;
    border-top-color: #007bff;
    border-radius: 50%;
    animation: initial-spin 0.8s linear infinite;
  }
  @keyframes initial-spin {
    to { transform: rotate(360deg); }
  }
  .initial-loader-text {
    margin-top: 16px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 14px;
    color: #666;
  }
  .initial-loader-content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

const preloaderScript = `
  (function() {
    function hideLoader() {
      var loader = document.getElementById('initial-loader');
      if (loader) {
        setTimeout(function() {
          loader.classList.add('hide');
          setTimeout(function() { loader.remove(); }, 300);
        }, 200);
      }
    }

    if (document.readyState === 'complete') {
      hideLoader();
    } else {
      window.addEventListener('load', hideLoader);
    }
  })();
`;

export const Preloader = () => {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: preloaderStyles }} />

      <div id="initial-loader">
        <div className="initial-loader-content">
          <div className="initial-loader-spinner" />
          <div className="initial-loader-text">Загрузка...</div>
        </div>
      </div>

      <script dangerouslySetInnerHTML={{ __html: preloaderScript }} />
    </>
  );
};
