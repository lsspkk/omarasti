import { useDeviceOrientation } from '../utils/useDeviceOrientation'


const Compass = ({ angle, cName, closeToMarker=false}) => {
    const orientation = useDeviceOrientation({})

    const alignNorth = (orientation === undefined || !orientation.available) ? {} : 
        { transformBox: 'fill-box', transformOrigin: 'center 50%', transform: `rotate(${Math.round(orientation.alpha)}deg)` }

    return (
        <svg width="258" height="265" className={cName} viewBox="0 0 258 265" fill="none" style={alignNorth} strokeWidth={closeToMarker ? 1 : 2}>
            <defs>
                <filter id="filter0_d" x="39.6432" y="198.81" width="29.1678" height="29.5406" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                    <feOffset dy="4" />
                    <feGaussianBlur stdDeviation="2" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
                </filter>
                <filter id="filter1_d" x="188.405" y="50.6465" width="29.9203" height="29.9203" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                    <feOffset dy="4" />
                    <feGaussianBlur stdDeviation="2" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
                </filter>
                <filter id="filter2_d" x="188.646" y="198.806" width="29.9203" height="29.9203" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                    <feOffset dy="4" />
                    <feGaussianBlur stdDeviation="2" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
                </filter>
                <filter id="filter3_d" x="39.6555" y="52.6376" width="28.9021" height="27.938" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                    <feOffset dy="4" />
                    <feGaussianBlur stdDeviation="2" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
                </filter>
                <filter id="filter4_d" x="86.5838" y="218.883" width="11.5456" height="14.8659" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                    <feOffset dy="4" />
                    <feGaussianBlur stdDeviation="2" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
                </filter>
                <filter id="filter5_d" x="159.162" y="46.0276" width="11.6027" height="14.8498" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                    <feOffset dy="4" />
                    <feGaussianBlur stdDeviation="2" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
                </filter>
                <filter id="filter6_d" x="208.235" y="169.415" width="14.8498" height="11.6027" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                    <feOffset dy="4" />
                    <feGaussianBlur stdDeviation="2" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
                </filter>
                <filter id="filter7_d" x="34.1501" y="98.8979" width="14.8921" height="11.4472" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                    <feOffset dy="4" />
                    <feGaussianBlur stdDeviation="2" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
                </filter>
                <filter id="filter8_d" x="34.4655" y="169.557" width="14.8331" height="11.6594" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                    <feOffset dy="4" />
                    <feGaussianBlur stdDeviation="2" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
                </filter>
                <filter id="filter9_d" x="208.03" y="98.6929" width="14.8498" height="11.6027" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                    <feOffset dy="4" />
                    <feGaussianBlur stdDeviation="2" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
                </filter>
                <filter id="filter10_d" x="159.402" y="219.018" width="11.6027" height="14.8498" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                    <feOffset dy="4" />
                    <feGaussianBlur stdDeviation="2" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
                </filter>
                <filter id="filter11_d" x="86.1619" y="46.0412" width="11.7558" height="14.8031" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                    <feOffset dy="4" />
                    <feGaussianBlur stdDeviation="2" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
                </filter>

                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="2.5" refY="2.5" orient="auto">
                    <polygon points="0 0, 5 2.5, 0 5" fill="#000000"/>
                </marker>

                </defs>
            { closeToMarker === true &&    
                <g opacity="0.5">
                <rect x="30" y="35" width="200" height="200" fill="#FA923B" />
                <path d="M214 51.5V221.5H44L214 51.5Z" fill="white" />
            </g>
            }
            <circle cx="129" cy="136" r="124.5" stroke="black" />
            <circle cx="129" cy="136" r="119.5" stroke="black" />
            <path d="M129 16V256" stroke="black" />
            <path d="M249 136L8.99992 135.02" stroke="black" />
            <g filter="url(#filter0_d)">
                <path d="M64.4542 199.16L44 220" stroke="black" />
            </g>
            <g filter="url(#filter1_d)">
                <path d="M192.759 72.2132L213.972 51" stroke="black" />
            </g>
            <g filter="url(#filter2_d)">
                <path d="M193 199.16L214.213 220.373" stroke="black" />
            </g>
            <g filter="url(#filter3_d)">
                <path d="M64.2132 72.2132L44 53" stroke="black" />
            </g>
            <g filter="url(#filter4_d)">
                <path d="M93.6657 219.07L91.0475 225.562" stroke="black" />
            </g>
            <g opacity="0.7" filter="url(#filter5_d)">
                <path d="M163.624 52.6861L166.302 46.219" stroke="black" />
            </g>
            <g filter="url(#filter6_d)">
                <path d="M212.427 169.877L218.894 172.556" stroke="black" />
            </g>
            <g filter="url(#filter7_d)">
                <path d="M44.8627 101.878L38.3297 99.3645" stroke="black" />
            </g>
            <g filter="url(#filter8_d)">
                <path d="M45.103 170.017L38.6611 172.756" stroke="black" />
            </g>
            <g opacity="0.7" filter="url(#filter9_d)">
                <path d="M212.222 101.834L218.689 99.1549" stroke="black" />
            </g>
            <g filter="url(#filter10_d)">
                <path d="M163.864 219.209L166.543 225.677" stroke="black" />
            </g>
            <g filter="url(#filter11_d)">
                <path d="M93.4607 52.6413L90.6188 46.2442" stroke="black" />
            </g>
            <path d="M129 0L139.392 16.5H118.608L129 0Z" fill="#B64949" stroke="#B64949" strokeWidth={closeToMarker ? 1 : 4}/>
            <path d="M-8.34742e-08 135L9.75 141.062L9.75 128.938L-8.34742e-08 135Z" fill="#A09C9C" stroke="#555555" strokeWidth={closeToMarker ? 1 : 4}/>
            <path d="M258 136L248.25 129.938L248.25 142.062L258 136Z" fill="#A09C9C" stroke="#555555" strokeWidth={closeToMarker ? 1 : 4}/>
            <path d="M129 265L135.062 255.25H122.938L129 265Z" fill="#A09C9C" stroke="#555555" strokeWidth={closeToMarker ? 1 : 4}/>


            { closeToMarker &&
            <line x1="129" y1="136" x2="136" y2="30"
                stroke="#000" strokeWidth="5"
                markerEnd="url(#arrowhead)"
                transform={`rotate(${angle})`}
                transform-origin='129 136'
            />
        }
            <circle cx="129" cy="136" r="4"  fill='grey' opacity='0.5' />


        </svg>

    )
}
export { Compass }