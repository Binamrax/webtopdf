(function () {
    const input=document.getElementById('webUrl');
    input.addEventListener("keyup", function (event) {
      // Number 13 is the "Enter" key on the keyboard
      if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("snap").click();
      }
    })
    document.getElementById("snap").addEventListener('click', () => {
      let bug = document.getElementById('bug');
      let loading = document.getElementById('loading');
      let url = input.value;
      bug.innerText = '';
      if (validURL(url)) {
        axios.get('/checkurl?url=' + url).then(r => {
          if (r.data && r.data.result) {
            loading.classList.remove('hide');
            axios.get('/pdf?url=' + url).then(a => {
              loading.classList.add('hide');
              if(a && a.data && a.data.result &&a.data.location){
                let ur = new URL(url);
                download(a.data.location);
              }else{
                bug.innerText="Some error occor";
              }
            }).catch(e => { loading.classList.add('hide'); });
          }else{
            bug.innerText = "Invalid Url or dosen't exist";
          }
        }).catch(e => { })
      } else {
        bug.innerText = "Invalid Url. Please put full url";
      }

    });
    function validURL(str) {
      var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
      return !!pattern.test(str);
    }
    function download(url) {
      var a = document.createElement("a");
      a.href = url;
      a.setAttribute("download",url.replace("/uploads/",""));
      console.log(url);
      a.click();
    }
    
  })();
