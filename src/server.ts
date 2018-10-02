import { get as httpLoad } from "http";
import { get as httpsLoad } from "https";

export interface OnChange {
  onUsdChange(usd: string): void;
  onTryChange(turky: string): void;
  onGreChange(gp: string): void;
  onTofelChange(tofel: string): void;
}

export class Fetcher {
  constructor(private emiter: OnChange) {}

  public refresh(): void {
    httpLoad("http://call.tgju.org/ajax.json", resp => {
      let data = "";
      var usd = false;
      var tr = false;
      // A chunk of data has been recieved.
      resp.on("data", (chunk: string) => {
        data += chunk;

        var reg = /\"price_dollar_rl\":{\"p\":\"(\d+,?\d+)\"/g;
        var match = reg.exec(data);

        if (match != null && !usd) {
          usd = true;
          this.emiter.onUsdChange(match[1]);
        }

        reg = /\"price_try\":{\"p\":\"(\d+,?\d+)\"/g;
        match = reg.exec(data);
        if (match != null && !tr) {
          tr = true;
          this.emiter.onTryChange(match[1]);
        }
      });
    });

    httpsLoad("https://www.tehranpayment.com/payment/Toefl-iBT/register", resp => {
        let data = "";
        let b = false;
        // A chunk of data has been recieved.
        resp.on("data", (chunk: string) => {
          data += chunk;
          var reg = /<span id=\"lblTotalPrice\">(\d+,?\d+,?\d+)/g;
          if (b == true) return;
          var match = reg.exec(data);
          if (match != null) {
            b = true;
            this.emiter.onTofelChange(match[1]);
          }
        });
    });

    httpsLoad("https://www.tehranpayment.com/payment/GRE/register-GRE-General", resp => {
          let data = "";
          let b = false;
          // A chunk of data has been recieved.
          resp.on("data", chunk => {
            data += chunk;
            var reg = /<span id=\"lblTotalPrice\">(\d+,?\d+,?\d+)/g;
            if (b == true) return;
            var match = reg.exec(data);
            if (match != null) {
              b = true;
                this.emiter.onGreChange(match[1]);
            }
          });
    });
  }
}
