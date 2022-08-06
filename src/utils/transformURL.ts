// using for social networks in DAO page
export function isValidHttpUrl(urlString: string) {
    try {
      new URL(urlString);
    } catch (_) {
      try{
        new URL("https:" + urlString)
        return "https:" + urlString
      }
      catch (_){
        return "./Error"
      }
    }
  
    return urlString;
  }