const smallSvgString = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-40 -40 80 80">
        <circle r="39" style="stroke-width:1; stroke:white"/>
        <path fill="#fff" d="M0,38a38,38 0 0 1 0,-76a19,19 0 0 1 0,38a19,19 0 0 0 0,38"/>
        <circle r="5" cy="19" fill="#fff"/>
        <circle r="5" cy="-19"/>
    </svg>
`;

const centralSvgString = `
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" height="3122" width="3122">
        <defs>
            <g id="triya" style="stroke:white; stroke-width:10;">
                <path d="M0 0  a780,780 0 0,0 1560,0  a1560,1560 0 0,0 -2340,-1351  A780,780 0 1,1 0,0  "/>
            </g>
            <circle id="circ" r="260" cx="780" style="stroke-width:1"/>
        </defs>
        <g transform="translate(1561,1561)">
            <use style="fill:red; stroke:red; stroke-width:1" xlink:href="#triya"/>
            <use transform="rotate(120)" style="fill:white; stroke:white; stroke-width:1" xlink:href="#triya"/>
            <use transform="rotate(240)" style="fill:black; stroke:black;" xlink:href="#triya"/>
            <use transform="rotate(120)" style="fill:black; stroke:black;" xlink:href="#circ"/>
            <use transform="rotate(240)" style="fill:red; stroke:red; stroke-width:1" xlink:href="#circ"/>
            <use transform="rotate(0)" style="fill:white; stroke:white; stroke-width:1" xlink:href="#circ"/>
        </g>
    </svg>
`;

export const centralYinYangSVG = new Image();

const centralSvgBlob = new Blob([centralSvgString], { type: 'image/svg+xml;charset=utf-8' });
const centralUrl = URL.createObjectURL(centralSvgBlob);
centralYinYangSVG.src = centralUrl;

export const smallYinYangSVG = new Image();

const smallSvgBlob = new Blob([smallSvgString], { type: 'image/svg+xml;charset=utf-8' });
const smallUrl = URL.createObjectURL(smallSvgBlob);
smallYinYangSVG.src = smallUrl;