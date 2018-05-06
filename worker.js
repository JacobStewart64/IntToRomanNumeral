this.onmessage = function(e) {
    const buffer = new ArrayBuffer(e.data[0]);
    if (e.data[0]) {
        const dataview = new DataView(buffer);
        const M = "M".charCodeAt(0);
        for (let i = 0; i < e.data[0]; i++) {
            dataview.setInt8(i, M);
        }
    }
    this.postMessage({buffer: buffer, id: e.data[1]}, [buffer]);
    this.close();
};