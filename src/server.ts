import { get as httpLoad } from "http";
import { get as httpsLoad } from "https";

export interface OnChange {
  onLoading(percent: number): void;
  onDone(usd: string, turky: string, gre: string, tofel: string): void;
}

export class Fetcher {
  constructor(private emiter: OnChange) {}
  usd = false;
  tr = false;
  tofel = false;
  gre = false;

  usd_v = "-";
  tr_v = "-";
  tofel_v = "-";
  gre_v = "-";
  private checkOnLoad() {
    let percent = 0;
    if (this.usd === true) {
      percent += 0.25;
    }
    if (this.tr === true) {
      percent += 0.25;
    }

    if (this.tofel === true) {
      percent += 0.25;
    }

    if (this.gre === true) {
      percent += 0.25;
    }

    this.emiter.onLoading(percent * 100);
    if (percent === 1) {
      setTimeout(() => {
        this.emiter.onDone(this.usd_v, this.tr_v, this.gre_v, this.tofel_v);
      }, 1000);
    }
  }
  public refresh(): void {
    this.usd = false;
    this.tr = false;
    this.tofel = false;
    this.gre = false;
    this.checkOnLoad();
    httpLoad("http://call.tgju.org/ajax.json", resp => {
      let data = "";

      // A chunk of data has been recieved.
      resp.on("data", (chunk: string) => {
        data += chunk;

        var reg = /\"price_dollar_rl\":{\"p\":\"(\d+,?\d+)\"/g;
        var match = reg.exec(data);

        if (match != null && !this.usd) {
          this.usd = true;
          this.usd_v = match[1];
          this.checkOnLoad();
        }

        reg = /\"price_try\":{\"p\":\"(\d+,?\d+)\"/g;
        match = reg.exec(data);
        if (match != null && !this.tr) {
          this.tr = true;
          this.tr_v = match[1];
          this.checkOnLoad();
        }
      });
    });

    httpsLoad(
      "https://www.tehranpayment.com/payment/Toefl-iBT/register",
      resp => {
        let data = "";
        // A chunk of data has been recieved.
        resp.on("data", (chunk: string) => {
          data += chunk;
          var reg = /<span id=\"lblTotalPrice\">(\d+,?\d+,?\d+)/g;
          if (this.tofel == true) return;
          var match = reg.exec(data);
          if (match != null) {
            this.tofel = true;
            this.tofel_v = match[1];
            this.checkOnLoad();
          }
        });
      }
    );

    httpsLoad(
      "https://www.tehranpayment.com/payment/GRE/register-GRE-General",
      resp => {
        let data = "";
        // A chunk of data has been recieved.
        resp.on("data", chunk => {
          data += chunk;
          var reg = /<span id=\"lblTotalPrice\">(\d+,?\d+,?\d+)/g;
          if (this.gre == true) return;
          var match = reg.exec(data);
          if (match != null) {
            this.gre = true;
            this.gre_v = match[1];
            this.checkOnLoad();
          }
        });
      }
    );
  }
}
