const c = (e) => document.querySelector(e)

const canvasMeme = c('canvas#canvas-gen')
const txTop = c('input[name="text-top"]')
const txBotm = c('input[name="text-bottom"]')
const btnInm = c('button[name="import"]')
const btnExp = c('button[name="export"]')
const btnShare = c('button[name="share"]')
const btnRes = c('input[name="default-res"]')
let dataImage = {
  src: "",
  w: "",
  h: "",
  def_w: 0,
  def_h: 0
}

function GenerateText() {
  const ctx = canvasMeme.getContext("2d")
  ctx.clearRect(0, 0, canvasMeme.width, canvasMeme.height)
  const img = new Image()
  img.src = dataImage.src
  if(btnRes.checked) {
    ctx.drawImage(img, 0, 0, dataImage.def_w, dataImage.def_h)
    ctx.font = `bold ${26+(dataImage.def_w/20)}px Poppins`
  } else {
    ctx.drawImage(img, 0, 0, dataImage.w, dataImage.h)
    ctx.font = "bold 26px Poppins"
  }
  ctx.textAlign = "center"
  ctx.fillStyle = "white"
  ctx.strokeStyle = "black"
  ctx.lineWidth = 3
  ctx.strokeText(txTop.value.toUpperCase(), canvasMeme.width/2, 40)
  ctx.fillText(txTop.value.toUpperCase(), canvasMeme.width/2, 40)
  ctx.strokeText(txBotm.value.toUpperCase(), canvasMeme.width/2, canvasMeme.height - 30)
  ctx.fillText(txBotm.value.toUpperCase(), canvasMeme.width/2, canvasMeme.height - 30)
}
btnRes.addEventListener("change", (e) => {
  console.log(btnRes.checked)
  if(btnRes.checked) {
    canvasMeme.width = dataImage.def_w
    canvasMeme.height = dataImage.def_h
    GenerateText()
  } else {
    canvasMeme.width = dataImage.w
    canvasMeme.height = dataImage.h
    GenerateText()
  }
})
btnShare.addEventListener("click", (e) => {
  canvasMeme.toBlob(async(blobs) => {
    if(!('share' in navigator)) {
      return alert("Saat ini, fitur bagikan tidak tersedia di browser anda")
    }
    const files = [new File([blobs], 'image.png', { type: blobs.type })]
    const share = {
      title: "Simple Generate Text Meme",
      text: `Buat meme sederhana disini ${location.href} !`,
      files
    }
    if (navigator.canShare(share)) {
      try {
        await navigator.share(share)
      } catch (err) {
        alert("Gagal membagikan media")
      }
    } else {
      alert("Saat ini, fitur bagikan tidak tersedia di browser anda")
    }
  })
})
txBotm.addEventListener("input", (e) => {
  GenerateText()
})
txTop.addEventListener("input", (e) => {
  GenerateText()
})
window.addEventListener("resize", (e) => {
  if(window.innerWidth > 500) {
    document.querySelector('div.responsive-canvas').style.width = "500px"
    return
  }
  document.querySelector('div.responsive-canvas').style.width = window.innerWidth+"px"
})
btnExp.addEventListener("click", async (e) => {
  const a = document.createElement("a")
  const url = canvasMeme.toDataURL("image/png")
  a.href = url
  a.target = "_blank"
  a.download = `Simple Generate Meme Text.png`
  a.click()
})
btnInm.addEventListener("click", (e) => {
  const dF = document.createElement("input")
  dF.type = "file"
  dF.click()
  dF.addEventListener('change', (e) => {
    let reader = new FileReader()
    reader.readAsDataURL(dF.files[0])
    reader.onload = () => {
      if(reader.result.split(";")[0].split(":")[1].split("/")[0] != "image") {
        alert("Tidak mendukung video apapun sejenisnya !")
        return ;
      }
      const img = new Image()
      img.onload = () => {
        let canva = { w: 0, h: 0 }
        if(img.width < 500) {
          let toNext = 500 - img.width
          canva = { w: img.width + toNext, h: img.height + toNext }
        } else {
          let toNext = img.width - 500
          canva = { w: 500, h: Number(String(img.height-toNext).replace("-","")) }
        }
        dataImage = {
          src: reader.result,
          ...canva,
          def_w: img.width,
          def_h: img.height
        }
        if(btnRes.checked) {
          canvasMeme.width = dataImage.def_w
          canvasMeme.height = dataImage.def_h
          GenerateText()
        } else {
          canvasMeme.width = dataImage.w
          canvasMeme.height = dataImage.h
          GenerateText()
        }
      }
      img.src = reader.result
    }
    reader.onerror = () => {
      alert("Kesalahan pada memasukan file, tidak ada isi pada file yang anda pilih")
    }
  })
})

document.querySelectorAll("button").forEach(button => {
  button.onmousedown = function(e) {

    const x = e.pageX - this.offsetLeft
    const y = e.pageY - this.offsetTop
    const w = this.offsetWidth
    
    const ripple = document.createElement('span')
    
    ripple.className = "ripple"
    ripple.style.left = x + "px"
    ripple.style.top  = y + "px"
    ripple.style.setProperty('--scale', w);

    this.appendChild(ripple)

    setTimeout(() => {
      ripple.parentNode.removeChild(ripple)
    }, 500)
  }
})
