class PeerService {
    constructor() {
      if (!this.peer) {
        this.peer = new RTCPeerConnection({
          iceServers: [
            {
              urls: [
                "stun:stun.l.google.com:19302",
                "stun:global.stun.twilio.com:3478",
              ],
            },
          ],
        });
      }

      this.screenSharePeer = new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.twilio.com:3478",
            ],
          },
        ],
      });

    }

    async getScreenShareAnswer(offer) {
      if (this.screenSharePeer) {
        await this.screenSharePeer.setRemoteDescription(offer);
        const ans = await this.screenSharePeer.createAnswer();
        await this.screenSharePeer.setLocalDescription(new RTCSessionDescription(ans));
        return ans;
      }
    }
  
    async setScreenShareLocalDescription(ans) {
      if (this.screenSharePeer) {
        await this.screenSharePeer.setRemoteDescription(new RTCSessionDescription(ans));
      }
    }
  
    async getScreenShareOffer() {
      if (this.screenSharePeer) {
        const offer = await this.screenSharePeer.createOffer();
        await this.screenSharePeer.setLocalDescription(new RTCSessionDescription(offer));
        return offer;
      }
    }
  
    async getAnswer(offer) {
      if (this.peer) {
        await this.peer.setRemoteDescription(offer);
        const ans = await this.peer.createAnswer();
        await this.peer.setLocalDescription(new RTCSessionDescription(ans));
        return ans;
      }
    }
  
    async setLocalDescription(ans) {
      if (this.peer) {
        await this.peer.setRemoteDescription(new RTCSessionDescription(ans));
      }
    }
  
    async getOffer() {
      if (this.peer) {
        const offer = await this.peer.createOffer();
        await this.peer.setLocalDescription(new RTCSessionDescription(offer));
        return offer;
      }
    }

  }
  
  export default new PeerService();
  