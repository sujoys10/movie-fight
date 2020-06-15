export const debounce = (fn , delay) => {
    let timer;
    return (...args) => {
      let context = this;
      if(timer) clearTimeout(timer);
      timer = setTimeout(() => {
        fn.apply(context, args);
      },delay)
    }
}