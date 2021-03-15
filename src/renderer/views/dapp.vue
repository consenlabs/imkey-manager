<template>
<div>
    <!-- <div>   -->
        <div class="tool-bar" v-if="showToolBar">
            <div class="left-tools">
                <svg class="tool-dapp tool" @click="showDapps" style="margin-left:17px" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#191C1E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M2 12H22" stroke="#191C1E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2V2Z" stroke="#191C1E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>

                <svg class="tool-line1" style="margin-left:17px" width="1" height="21" viewBox="0 0 1 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="0.5" y1="2.18557e-08" x2="0.499999" y2="21" stroke="#EAECF6"/>
                </svg>

                <svg class="tool-previous tool" style="margin-left:26px" @click="goBack" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 20L6 12L14 4" stroke="#191C1E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>

                <svg class="tool-next tool" style="margin-left:18px" @click="goForward" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 20L16 12L8 4" stroke="#191C1E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>

                <svg class="tool-line2" style="margin-left:26px" width="1" height="21" viewBox="0 0 1 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="0.5" y1="2.18557e-08" x2="0.499999" y2="21" stroke="#EAECF6"/>
                </svg>

                <div id="container2" class="container2" tabIndex=-1>
                    <svg class="tool-more tool menu-button" style="margin-left:15px" width="17" height="3" viewBox="0 0 17 3" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M3 1.5C3 2.32843 2.32843 3 1.5 3C0.671573 3 0 2.32843 0 1.5C0 0.671573 0.671573 0 1.5 0C2.32843 0 3 0.671573 3 1.5ZM10 1.5C10 2.32843 9.32843 3 8.5 3C7.67157 3 7 2.32843 7 1.5C7 0.671573 7.67157 0 8.5 0C9.32843 0 10 0.671573 10 1.5ZM15.5 3C16.3284 3 17 2.32843 17 1.5C17 0.671573 16.3284 0 15.5 0C14.6716 0 14 0.671573 14 1.5C14 2.32843 14.6716 3 15.5 3Z" fill="#43454F"/>
                    </svg>

                    <div class="menu-list">
                        <div class="menu" @click="refresh" >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M23 6V10H19" stroke="#191C1E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M20.2384 15.3312C19.5233 17.3755 18.1695 19.1297 16.3812 20.3295C14.5929 21.5293 12.467 22.1096 10.3237 21.9829C8.18044 21.8563 6.13597 21.0296 4.4984 19.6275C2.86084 18.2253 1.71888 16.3236 1.24462 14.209C0.770363 12.0944 0.989494 9.88138 1.86899 7.90347C2.74849 5.92556 4.24071 4.28991 6.12079 3.243C8.00087 2.19608 10.1669 1.79462 12.2926 2.09912C14.4183 2.40361 16.3883 3.39755 17.906 4.93118L23 9.77562" stroke="#191C1E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <p style="padding-left:19px">
                                Refresh
                            </p>
                        </div>

                        <div class="menu" @click="copyLink">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 9H11C9.89543 9 9 9.89543 9 11V20C9 21.1046 9.89543 22 11 22H20C21.1046 22 22 21.1046 22 20V11C22 9.89543 21.1046 9 20 9Z" stroke="#191C1E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M5 15H4C3.46957 15 2.96086 14.7893 2.58579 14.4142C2.21071 14.0391 2 13.5304 2 13V4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H13C13.5304 2 14.0391 2.21071 14.4142 2.58579C14.7893 2.96086 15 3.46957 15 4V5" stroke="#191C1E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <p style="padding-left:19px">
                                Copy Link
                            </p>
                        </div>

                        <div class="menu" @click="openInSafari">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#191C1E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M16.24 7.75977L14.12 14.1198L7.76001 16.2398L9.88001 9.87977L16.24 7.75977Z" stroke="#191C1E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <p style="padding-left:19px">
                                Open in Safari
                            </p>
                        </div>
                    </div>
                </div>

                <svg class="tool-line3" style="margin-left:15px;display:none" width="1" height="21" viewBox="0 0 1 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="0.5" y1="2.18557e-08" x2="0.499999" y2="21" stroke="#EAECF6"/>
                </svg>
            </div>

            <div class="right-tools" v-if="showRightTools">
                <img style="width:24px;height:24px;margin-left:19px" v-bind:src="iconUrl" >
                <p>{{ title }}</p>

                <svg style="margin-left:15px" width="1" height="21" viewBox="0 0 1 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="0.5" y1="2.18557e-08" x2="0.499999" y2="21" stroke="#EAECF6"/>
                </svg>

                <svg class="tool" @click="closeDapp" style="margin-left:25px" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.5 3.5L3.5 10.5" stroke="#9598AB" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M3.5 3.5L10.5 10.5" stroke="#9598AB" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
        </div>
    <!-- </div> -->
    <div style="background:#EAECF6;height:1px"></div>
    <div class="container">
        <h2>{{$t('m.dapp.newest_launched')}}</h2>
        <div class="appBox">
                <!-- <a class="link6" @click="openUrl('TokenLon')">
                    <div class="cbox">
                        <svg width="100" height="21" viewBox="0 0 100 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14.3035 12.9684C14.8632 12.1456 15.1119 11.1962 15.1119 10.1835C15.1119 7.33544 12.7488 4.99367 9.82587 4.99367C8.58209 4.99367 7.33831 5.43671 6.40547 6.25949L6.34328 6.32279C6.34328 6.32279 6.34328 6.32279 6.28109 6.32279C6.28109 6.32279 6.28109 6.32279 6.2189 6.38608C6.15672 6.38608 6.15672 6.44937 6.09453 6.44937C6.03234 6.51266 5.97015 6.57595 5.97015 6.57595C5.41045 7.20886 5.03731 7.96836 4.78856 8.79114C4.78856 8.79114 4.78856 8.79114 4.78856 8.85443C4.35323 10.2468 4.35323 11.9557 5.22388 13.8544C6.65423 17.019 10.199 18.6646 14.1169 18.6013C14.5522 18.6013 14.7388 19.1709 14.3657 19.4241C12.9975 20.1835 11.4428 20.5633 9.82587 20.5633C4.41542 20.5 0 16.0696 0 10.5C0 5.37342 3.85572 1.06962 8.76866 0.563291C9.14179 0.5 9.51493 0.5 9.82587 0.5C11.8781 0.5 13.9303 1.1962 15.6095 2.39873C16.0448 2.71519 16.4801 3.09494 16.8532 3.47468C17.7861 4.48734 18.2836 5.87975 18.2836 7.33544C18.2836 9.93038 16.6045 12.1456 14.3035 12.9684Z" fill="url(#paint0_linear)"/>
                            <path d="M19.5273 10.4367C19.5273 10.5 19.5273 10.5 19.5273 10.4367C19.5273 13.7278 17.3507 16.5126 14.3656 17.1456C13.9925 17.2088 13.6815 17.2721 13.3084 17.2721C9.70141 17.5886 6.96509 15.8797 5.72131 13.0316C5.59693 12.7152 5.47255 12.3354 5.34817 11.8924C5.28598 11.5759 5.22379 11.2595 5.1616 10.943C5.09942 10.2468 5.1616 9.55062 5.28598 8.85442V8.79112C5.34817 8.60125 5.41036 8.41138 5.53474 8.2215C5.84568 7.71518 6.65414 7.84176 6.77852 8.47467C6.9029 9.10758 7.08947 9.86707 7.33822 10.3101C8.33325 12.0823 10.1989 13.2848 12.3755 13.2848C13.0596 13.2848 13.6815 13.1582 14.3656 12.905C16.6044 12.0823 18.2213 9.86707 18.2213 7.27214C18.2213 5.87973 17.7238 4.48733 16.8531 3.41138C18.3457 4.99366 19.2163 7.01897 19.4651 9.23416C19.5273 9.6772 19.5273 10.0569 19.5273 10.4367Z" fill="url(#paint1_linear)"/>
                            <path d="M77.1768 7.84177H78.3583V13.7278H81.5922V14.8038H77.1768V7.84177Z" fill="#270F34"/>
                            <path d="M47.3882 7.77849H48.632V10.6266L51.0573 7.77849H52.4255L50.3733 10.2468L52.6121 14.6772H51.3683L49.627 11.1962L48.632 12.462V14.6772H47.3882V7.77849Z" fill="#270F34"/>
                            <path d="M99.9998 14.7405H99.1291C98.8804 14.7405 98.6316 14.6139 98.5072 14.3608L96.0197 9.99366V10.943V12.7152V14.7405H94.7759V7.84177H95.7087C95.8953 7.84177 96.0818 7.96835 96.2062 8.09493L98.8182 12.5886V7.84177H100.062L99.9998 14.7405Z" fill="#270F34"/>
                            <path d="M72.2014 14.7405H71.3308C71.082 14.7405 70.8333 14.6139 70.7089 14.3608L68.2213 9.99366V10.943V12.7152V14.7405H66.9775V7.84177H67.9104C68.0969 7.84177 68.2835 7.96835 68.4079 8.09493L71.0198 12.5886V7.84177H72.2636L72.2014 14.7405Z" fill="#270F34"/>
                            <path d="M30.6593 8.79115H28.5449V7.77849H34.0176V8.79115H31.9031V14.6772H30.6593V8.79115Z" fill="#270F34"/>
                            <path d="M61.7536 13.7278V14.7405H57.4004V7.84177H58.582H61.5671V8.85442H58.582V10.5633H61.2561V11.6392H58.582V13.7278H61.7536Z" fill="#270F34"/>
                            <path d="M42.9724 9.67719C42.848 9.23415 42.6615 8.8544 42.4127 8.53794C42.164 8.22149 41.9152 8.03162 41.5421 7.84174C40.858 7.52529 40.0495 7.52529 39.3655 7.84174C39.0545 8.03162 38.7436 8.22149 38.4948 8.53794C38.246 8.8544 38.0595 9.23415 37.9351 9.67719C37.8107 10.1202 37.7485 10.6266 37.7485 11.1962C37.7485 11.7658 37.8107 12.2721 37.9351 12.7152C38.0595 13.1582 38.246 13.5379 38.4948 13.8544C39.3033 14.9303 40.7958 15.1835 41.853 14.3607C42.0396 14.2341 42.2262 14.0443 42.3505 13.8544C42.5993 13.5379 42.7859 13.0949 42.9102 12.7152C43.0346 12.2721 43.0968 11.7658 43.0968 11.1962C43.0968 10.6266 43.0968 10.1202 42.9724 9.67719ZM40.4849 13.7911C39.552 13.7911 39.0545 12.6519 39.0545 11.1962C39.0545 9.74048 39.6142 8.60124 40.4849 8.60124C41.4177 8.60124 41.9152 9.74048 41.9152 11.1962C41.9152 12.6519 41.4177 13.7911 40.4849 13.7911Z" fill="#270F34"/>
                            <path d="M90.2361 9.67719C90.1117 9.23415 89.9251 8.8544 89.6764 8.53794C89.4276 8.22149 89.1789 8.03162 88.8057 7.84174C88.1217 7.52529 87.3132 7.52529 86.6291 7.84174C86.3182 8.03162 86.0072 8.22149 85.7585 8.53794C85.5097 8.8544 85.3232 9.23415 85.1988 9.67719C85.0744 10.1202 85.0122 10.6266 85.0122 11.1962C85.0122 11.7658 85.0744 12.2721 85.1988 12.7152C85.3232 13.1582 85.5097 13.5379 85.7585 13.8544C86.5669 14.9303 88.0595 15.1835 89.1167 14.3607C89.3033 14.2341 89.4898 14.0443 89.6142 13.8544C89.863 13.5379 90.0495 13.0949 90.1739 12.7152C90.2983 12.2721 90.3605 11.7658 90.3605 11.1962C90.3605 10.6266 90.3605 10.1202 90.2361 9.67719ZM87.7485 13.7911C86.8157 13.7911 86.3182 12.6519 86.3182 11.1962C86.3182 9.74048 86.8779 8.60124 87.7485 8.60124C88.6814 8.60124 89.1789 9.74048 89.1789 11.1962C89.1789 12.6519 88.7436 13.7911 87.7485 13.7911Z" fill="#270F34"/>
                            <defs>
                                <linearGradient id="paint0_linear" x1="0" y1="10.5101" x2="18.3063" y2="10.5101" gradientUnits="userSpaceOnUse">
                                    <stop stop-color="#2D2D4C"/>
                                    <stop offset="1" stop-color="#1E1E3A"/>
                                </linearGradient>
                                <linearGradient id="paint1_linear" x1="5.17535" y1="10.3945" x2="19.5513" y2="10.3945" gradientUnits="userSpaceOnUse">
                                    <stop stop-color="#96A2D4"/>
                                    <stop offset="1" stop-color="#594DA0"/>
                                </linearGradient>
                            </defs>
                        </svg>

                        <p>{{$t('m.imKeyManager.tokenlon_info')}}</p>
                    </div>
                </a>
                <div class="dbox" >
                        <span class="leftLine">——</span>
                        <span class="comingsoon">{{$t('m.imKeyManager.coming_soon')}}</span>
                        <span class="rightLine">——</span>
                </div> -->
                <a class="dapp" @click="openUrl('TokenLon')">
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0-tokenlon)">
                        <rect width="64" height="64" fill="white"/>
                        <g filter="url(#filter0_d)">
                        <rect x="0.25" y="0.25" width="63.5" height="63.5" rx="11.75" stroke="#D5DCE0" stroke-width="0.5"/>
                        </g>
                        <path d="M41.8344 36.4875C42.9684 34.7865 43.5984 32.7705 43.5984 30.6076C43.5984 24.5386 38.4955 19.6037 32.1745 19.6037C29.3606 19.6037 26.7776 20.5907 24.8036 22.2077C24.7406 22.2497 24.6776 22.2917 24.6146 22.3547C24.5936 22.3757 24.5726 22.3967 24.5306 22.4177C24.5096 22.4387 24.4676 22.4807 24.4466 22.5017C24.3626 22.5647 24.2996 22.6277 24.2156 22.7117C24.1107 22.8167 24.0056 22.9216 23.9216 23.0266C22.7037 24.3076 21.8637 25.9666 21.4227 27.7516C21.4227 27.7726 21.4017 27.7936 21.4017 27.8356C20.5407 30.7336 20.4567 34.4085 22.3257 38.3775C25.4126 44.9924 33.0145 48.5833 41.4564 48.3523C41.4774 48.3523 41.4774 48.3523 41.4984 48.3523C42.4644 48.3313 42.8214 49.6123 41.9814 50.0533C39.0835 51.5653 35.7655 52.4053 32.2795 52.4053C20.6037 52.4053 11.1538 42.9554 11.1538 31.2795C11.1538 20.3807 19.4277 11.3928 30.0326 10.2798C30.7676 10.1958 31.5236 10.1538 32.2795 10.1538C36.9205 10.1538 41.2254 11.6448 44.7114 14.1858C45.6564 14.8787 46.5384 15.6347 47.3574 16.4747C49.3103 18.6797 50.4863 21.5147 50.4863 24.6226C50.4863 30.1036 46.8744 34.7655 41.8344 36.4875Z" fill="url(#paint0_linear)"/>
                        <path d="M53.1537 31.1759C53.1537 31.2179 53.1537 31.2599 53.1537 31.3019C53.1117 38.1478 48.5128 43.9648 42.1079 45.3087C41.3309 45.4767 40.4699 45.5817 39.8189 45.6447C32.07 46.2747 26.1691 42.6418 23.5441 36.7408C23.1661 35.9009 22.8931 35.0609 22.7041 34.2629C22.5361 33.5909 22.4101 32.9399 22.3471 32.2889C22.3471 32.2679 22.3471 32.2469 22.3471 32.2259C22.1791 30.6509 22.3261 29.1809 22.6411 27.858C22.6411 27.837 22.6411 27.816 22.6411 27.795C22.6621 27.732 22.6831 27.669 22.6831 27.606C22.7881 27.165 22.9981 26.766 23.2291 26.409C23.9641 25.338 25.6021 25.674 25.8751 26.934C26.1481 28.2779 26.5681 29.8319 27.0931 30.7559C29.2351 34.5359 33.267 37.0978 37.9079 37.0978C39.3779 37.0978 40.8059 36.8458 42.1289 36.3629C46.9378 34.6199 50.3608 29.9789 50.3608 24.519C50.3608 21.411 49.2268 18.5761 47.3788 16.3711C50.4028 19.6051 52.4818 23.868 53.0067 28.6139C53.1117 29.4749 53.1537 30.3149 53.1537 31.1759Z" fill="url(#paint1_linear)"/>
                        </g>
                        <defs>
                        <filter id="filter0_d" x="-2" y="0" width="68" height="68" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
                        <feOffset dy="2"/>
                        <feGaussianBlur stdDeviation="1"/>
                        <feColorMatrix type="matrix" values="0 0 0 0 0.9504 0 0 0 0 0.9552 0 0 0 0 0.96 0 0 0 1 0"/>
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
                        </filter>
                        <linearGradient id="paint0_linear" x1="11.1538" y1="31.2907" x2="50.4798" y2="31.2907" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#2D2D4C"/>
                        <stop offset="1" stop-color="#1E1E3A"/>
                        </linearGradient>
                        <linearGradient id="paint1_linear" x1="22.2725" y1="31.048" x2="53.1537" y2="31.048" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#8592B9"/>
                        <stop offset="1" stop-color="#6D5D91"/>
                        </linearGradient>
                        <clipPath id="clip0-tokenlon">
                        <rect width="64" height="64" fill="white"/>
                        </clipPath>
                        </defs>
                    </svg>
                    <div class="dapp-info">
                        <p class="dapp-name">TokenLon</p>
                        <p class="dapp-desc">{{$t('m.dapp.tokenlon_desc')}}</p>
                    </div>
                </a>

                <a class="dapp" @click="openUrl('Sushiswap')">
                        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                        <mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="64" height="64">
                        <rect width="64" height="64" rx="12" fill="#C4C4C4"/>
                        </mask>
                        <g mask="url(#mask0)">
                        <rect width="64" height="64" fill="url(#pattern0)"/>
                        </g>
                        <defs>
                        <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
                        <use xlink:href="#image0" transform="scale(0.0025)"/>
                        </pattern>
                        <image id="image0" width="400" height="400" xlink:href="data:image/jpeg;base64,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"/>
                        </defs>
                    </svg>

                    <div class="dapp-info">
                        <p class="dapp-name">Sushiswap</p>
                        <p class="dapp-desc">{{$t('m.dapp.sushiswap_desc')}}</p>
                    </div>
                </a>

                <a class="dapp" @click="openUrl('Uniswap')">
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="64" height="64" fill="white"/>
                        <g clip-path="url(#clip0-uniswap)">
                        <path d="M24.7877 15.0458C24.2706 14.9724 24.2459 14.948 24.4922 14.9236C24.9601 14.8502 26.0437 14.948 26.8072 15.1191C28.5803 15.5346 30.1811 16.6101 31.8804 18.4921L32.3237 19.0054L32.964 18.9076C35.6976 18.4677 38.5051 18.8098 40.8447 19.8853C41.485 20.1786 42.4947 20.7652 42.6178 20.9119C42.6671 20.9607 42.741 21.2785 42.7902 21.5962C42.9626 22.745 42.8887 23.6005 42.5193 24.2604C42.3223 24.6271 42.3223 24.7248 42.4455 25.0426C42.544 25.287 42.8395 25.4581 43.1104 25.4581C43.7014 25.4581 44.3171 24.5293 44.6126 23.2339L44.7358 22.7206L44.9574 22.965C46.2134 24.3582 47.1985 26.2891 47.3463 27.6579L47.3955 28.0245L47.1739 27.7068C46.8045 27.1446 46.4597 26.778 45.9918 26.4602C45.1544 25.898 44.2679 25.7269 41.9283 25.6047C39.8103 25.4825 38.6036 25.3114 37.4215 24.9204C35.4021 24.2604 34.3677 23.405 31.9789 20.2519C30.9199 18.8587 30.255 18.101 29.59 17.4655C28.137 16.0723 26.684 15.3391 24.7877 15.0458Z" fill="#FF007A"/>
                        <path d="M43.1347 18.1499C43.184 17.2211 43.3071 16.61 43.578 16.0478C43.6765 15.8279 43.775 15.6323 43.7996 15.6323C43.8243 15.6323 43.775 15.8034 43.7011 15.999C43.5041 16.5367 43.4795 17.2944 43.6026 18.1499C43.775 19.2497 43.8489 19.3964 45.031 20.5941C45.5728 21.1562 46.2131 21.865 46.4594 22.1584L46.878 22.6961L46.4594 22.305C45.9422 21.8162 44.7601 20.8874 44.4892 20.7652C44.3168 20.6674 44.2922 20.6674 44.169 20.7896C44.0705 20.8874 44.0459 21.034 44.0459 21.7428C44.0213 22.8427 43.8735 23.5271 43.5041 24.2359C43.3071 24.6026 43.2825 24.5292 43.4549 24.1137C43.578 23.796 43.6026 23.6493 43.6026 22.5983C43.6026 20.4719 43.3564 19.9586 41.8541 19.1031C41.4847 18.8831 40.8444 18.5654 40.475 18.3943C40.0809 18.2232 39.7854 18.0765 39.81 18.0765C39.8593 18.0276 41.3123 18.4432 41.8787 18.6876C42.7407 19.0298 42.8884 19.0542 42.9869 19.0298C43.0608 18.9564 43.1101 18.7609 43.1347 18.1499Z" fill="#FF007A"/>
                        <path d="M25.7974 21.7918C24.763 20.3741 24.0981 18.1743 24.2458 16.5367L24.2951 16.0234L24.5414 16.0723C24.9847 16.1456 25.7481 16.439 26.1175 16.6589C27.1026 17.2455 27.5459 18.0521 27.9645 20.0564C28.0877 20.643 28.2601 21.3274 28.334 21.5473C28.4571 21.914 28.925 22.7694 29.319 23.3072C29.5899 23.6982 29.4176 23.8938 28.8019 23.8449C27.866 23.7471 26.6101 22.8917 25.7974 21.7918Z" fill="#FF007A"/>
                        <path d="M41.8789 32.4238C37.0027 30.4685 35.2788 28.782 35.2788 25.9223C35.2788 25.5067 35.3034 25.1646 35.3034 25.1646C35.3281 25.1646 35.5005 25.3112 35.7221 25.4823C36.7072 26.2644 37.8154 26.6066 40.8938 27.0466C42.6916 27.3155 43.7259 27.511 44.6618 27.8287C47.6417 28.8064 49.4887 30.8107 49.932 33.5237C50.0552 34.3059 49.9813 35.7968 49.7842 36.579C49.6119 37.19 49.1193 38.3144 48.9962 38.3388C48.9716 38.3388 48.9223 38.2166 48.9223 38.0211C48.873 36.9945 48.3559 36.0168 47.4939 35.2591C46.4596 34.3792 45.1297 33.7193 41.8789 32.4238Z" fill="#FF007A"/>
                        <path d="M38.431 33.2306C38.3817 32.864 38.2586 32.3996 38.1847 32.204L38.0616 31.8374L38.2832 32.1063C38.6034 32.4729 38.8497 32.9129 39.0713 33.5239C39.2437 33.9883 39.2437 34.135 39.2437 34.8927C39.2437 35.6259 39.2191 35.797 39.0713 36.2125C38.825 36.8725 38.5295 37.3369 38.037 37.8501C37.1504 38.7545 35.9929 39.2433 34.3429 39.4633C34.0474 39.4878 33.21 39.5611 32.4712 39.61C30.6242 39.7077 29.3928 39.9033 28.2846 40.2944C28.1368 40.3432 27.9891 40.3921 27.9644 40.3677C27.9152 40.3188 28.6786 39.8788 29.2943 39.5855C30.1562 39.17 31.0428 38.95 32.9884 38.6079C33.9488 38.4612 34.9339 38.2657 35.1802 38.1679C37.6183 37.4102 38.825 35.5282 38.431 33.2306Z" fill="#FF007A"/>
                        <path d="M40.6722 37.1655C40.0318 35.7723 39.8841 34.4524 40.2289 33.2058C40.2781 33.0836 40.3274 32.9614 40.3766 32.9614C40.4259 32.9614 40.5736 33.0348 40.7214 33.1325C41.0169 33.3281 41.6326 33.6702 43.2088 34.5257C45.2036 35.6012 46.3364 36.4322 47.1245 37.3854C47.814 38.2165 48.2327 39.1697 48.4297 40.3429C48.5529 41.0029 48.479 42.5916 48.3066 43.2515C47.7648 45.3291 46.5334 46.9912 44.7356 47.9444C44.4647 48.0911 44.2431 48.1888 44.2185 48.1888C44.1938 48.1888 44.2924 47.9444 44.4401 47.6511C45.0312 46.4046 45.1051 45.2069 44.6618 43.8626C44.3909 43.0316 43.8244 42.0294 42.6916 40.3429C41.3371 38.3876 41.0169 37.8743 40.6722 37.1655Z" fill="#FF007A"/>
                        <path d="M22.3248 44.6448C24.1472 43.1294 26.3883 42.0539 28.457 41.7118C29.3435 41.5651 30.8212 41.614 31.6339 41.834C32.9391 42.1762 34.1212 42.9094 34.7369 43.8138C35.328 44.6937 35.5989 45.4514 35.8698 47.1379C35.9683 47.7978 36.0914 48.4822 36.116 48.6289C36.3131 49.5088 36.7071 50.1932 37.1996 50.5598C37.9631 51.122 39.2929 51.1464 40.5982 50.6576C40.8198 50.5842 41.0169 50.5109 41.0169 50.5353C41.0661 50.5842 40.4012 51.0242 39.9579 51.2442C39.3422 51.5619 38.8497 51.6597 38.1847 51.6597C37.0026 51.6597 35.9929 51.0486 35.1802 49.8265C35.0078 49.5821 34.663 48.8733 34.3675 48.2133C33.5055 46.2335 33.0623 45.6469 32.0525 44.987C31.166 44.4248 30.0331 44.3026 29.1712 44.7181C28.0383 45.2559 27.7428 46.6979 28.5308 47.5779C28.851 47.9445 29.4421 48.2378 29.9346 48.3111C30.8458 48.4333 31.6339 47.7245 31.6339 46.8202C31.6339 46.2335 31.4122 45.8914 30.8212 45.6225C30.0331 45.2803 29.1712 45.6714 29.1958 46.4291C29.1958 46.7468 29.3435 46.9424 29.6637 47.089C29.8607 47.1868 29.8607 47.1868 29.713 47.1623C28.9988 47.0157 28.8264 46.1358 29.3928 45.5736C30.0824 44.8892 31.5354 45.1825 32.0279 46.1358C32.2249 46.5268 32.2496 47.309 32.0772 47.7978C31.6585 48.8733 30.4764 49.4355 29.2697 49.1177C28.457 48.8977 28.1122 48.6777 27.1271 47.6756C25.4032 45.9158 24.7383 45.5736 22.2755 45.207L21.8076 45.1336L22.3248 44.6448Z" fill="#FF007A"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M9.36967 5.31761C15.1078 12.2347 23.949 22.9892 24.3923 23.5758C24.7617 24.0647 24.6139 24.5291 23.9982 24.8713C23.6535 25.0668 22.9393 25.2623 22.5945 25.2623C22.2005 25.2623 21.7325 25.0668 21.4124 24.749C21.1907 24.5291 20.2303 23.1359 18.0631 19.7873C16.4131 17.2209 15.0093 15.0944 14.9847 15.07C14.8862 15.0211 14.8862 15.0211 17.8907 20.3495C19.787 23.698 20.4027 24.8957 20.4027 25.0424C20.4027 25.3601 20.3042 25.5312 19.9101 25.9712C19.2452 26.7044 18.9497 27.5354 18.728 29.2708C18.4817 31.2018 17.8168 32.5705 15.9205 34.8925C14.8123 36.2613 14.6399 36.5057 14.369 37.0678C14.0242 37.7522 13.9257 38.1433 13.8765 39.0232C13.8272 39.952 13.9257 40.5386 14.1966 41.4185C14.4429 42.2007 14.7138 42.714 15.3787 43.7161C15.9451 44.596 16.2899 45.2559 16.2899 45.5004C16.2899 45.6959 16.3392 45.6959 17.2258 45.5004C19.3437 45.0115 21.0922 44.1805 22.0527 43.1539C22.6437 42.5184 22.7915 42.1762 22.7915 41.2963C22.7915 40.7342 22.7669 40.6119 22.6191 40.2698C22.3728 39.732 21.9049 39.2921 20.8952 38.6077C19.5653 37.7033 18.9989 36.9701 18.8512 35.9924C18.728 35.1614 18.8758 34.5992 19.6146 33.0593C20.378 31.4706 20.5751 30.8107 20.6982 29.1975C20.7721 28.1709 20.8952 27.7554 21.1907 27.4377C21.5109 27.0955 21.7818 26.9733 22.5452 26.8755C23.8012 26.7044 24.6139 26.3867 25.2542 25.7756C25.8207 25.2623 26.0669 24.749 26.0916 23.9913L26.1162 23.4292L25.796 23.087C24.6385 21.7671 8.60623 4.2666 8.53235 4.2666C8.50772 4.2666 8.90175 4.731 9.36967 5.31761ZM16.9302 40.0742C17.2011 39.6098 17.0534 39.0232 16.6101 38.7299C16.1914 38.461 15.5511 38.5833 15.5511 38.9499C15.5511 39.0476 15.6004 39.1454 15.7481 39.1943C15.9698 39.3165 15.9944 39.4387 15.822 39.7076C15.6496 39.9764 15.6496 40.2209 15.8713 40.392C16.216 40.6608 16.684 40.5142 16.9302 40.0742Z" fill="#FF007A"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M26.9057 27.218C26.3147 27.389 25.7482 28.0245 25.5758 28.66C25.4773 29.0511 25.5266 29.7599 25.699 29.9799C25.9699 30.3221 26.2161 30.4199 26.9057 30.4199C28.2602 30.4199 29.4177 29.8332 29.5408 29.1244C29.664 28.5378 29.1468 27.7312 28.4326 27.3646C28.0632 27.1691 27.2997 27.0957 26.9057 27.218ZM28.4819 28.4401C28.6789 28.1467 28.605 27.829 28.2356 27.609C27.5706 27.1935 26.5609 27.5357 26.5609 28.1712C26.5609 28.4889 27.0781 28.8311 27.5706 28.8311C27.8908 28.8311 28.3341 28.6356 28.4819 28.4401Z" fill="#FF007A"/>
                        </g>
                        <rect x="0.25" y="0.25" width="63.5" height="63.5" rx="11.75" stroke="#D5DCE0" stroke-width="0.5"/>
                        <defs>
                        <clipPath id="clip0-uniswap">
                        <rect width="41.4476" height="47.3687" fill="white" transform="translate(8.53345 4.2666)"/>
                        </clipPath>
                        </defs>
                    </svg>

                    <div class="dapp-info">
                        <p class="dapp-name">Uniswap</p>
                        <p class="dapp-desc">{{$t('m.dapp.uniswap_desc')}}</p>
                    </div>
                </a>

                <a class="dapp" @click="openUrl('PolkadotJS')">

                    <svg width="66" height="66" viewBox="0 0 66 66" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                        <rect x="11" y="11" width="44" height="44" fill="url(#pattern0-polkadot)"/>
                        <rect x="1" y="1" width="64" height="64" rx="12" stroke="#D5DCE0" stroke-width="0.5"/>
                        <defs>
                        <pattern id="pattern0-polkadot" patternContentUnits="objectBoundingBox" width="1" height="1">
                        <use xlink:href="#image0-polkadot" transform="scale(0.00357143)"/>
                        </pattern>
                        <image id="image0-polkadot" width="280" height="280" xlink:href="data:image/png;base64,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"/>
                        </defs>
                    </svg>
                    <div class="dapp-info">
                        <p class="dapp-name">PolkadotJS</p>
                        <p class="dapp-desc">{{$t('m.dapp.polkadotJS_desc')}}</p>
                    </div>
                </a>

                <a class="dapp" @click="openUrl('Multisender')">

<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="64" height="64" fill="white"/>
<rect x="0.25" y="0.25" width="63.5" height="63.5" rx="11.75" fill="#17264E" stroke="#D5DCE0" stroke-width="0.5"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M48 48.0212L47.931 28.4302L32 36.8472V36.8722L16.069 28.4742L16 48.0212L11 45.2702V20.0762L32 30.9362V30.8972L53 20.0142V45.2642L48 48.0212Z" fill="#9CD8FF"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M31.9999 26.0208L15.0039 17.4088L19.6129 15.0088L31.9999 21.2208L44.3869 15.0088L48.9959 17.4088L31.9999 26.0208ZM23.0049 44.4998L19.9939 47.0218V35.0048L23.0049 36.7608V44.4998ZM44.0059 47.0218L40.9949 44.4998V36.7608L44.0059 35.0048V47.0218Z" fill="#10B3FF"/>
</svg>

                    <div class="dapp-info">
                        <p class="dapp-name">Multisender</p>
                        <p class="dapp-desc">{{$t('m.dapp.multisender_desc')}}</p>
                    </div>
                </a>
        </div>
        <div class="statusBox status5" v-if="status==1">
            <div class="status5Alert">
                <div class="status5AlertBox">
                    <h4>{{$t('m.imKeyManager.found_dapp_access')}}</h4>
                    <p>{{viewInfo}}</p>

                    <div class="view_button" style="display:inline-block;float: left;">
                        <button class="cancel" @click="cancel">{{$t('m.imKeyManager.cancel')}}</button>
                        <button class="ok" @click="confirm">{{$t('m.imKeyManager.ok')}}</button>
                    </div>
                </div>
            </div>
        </div>
        </div>
</div>
</template>

<script>
import { ipcRenderer } from 'electron'
const { dialog } = require('electron').remote
let url
export default {
  name: 'welcomeHome',
  data () {
    return {
      status: 0, // 0显示 1不显示
      name: this.$t('m.setting.info'),
      viewInfo: '正在访问你的地址请确认,注意财产安全',
      showToolBar: false,
      iconUrl: 'https://tokenlon.im/images/favico.png',
      title: 'xxxxxxx',
      showRightTools: true
    }
  },
  mounted () {
    // this.ShowMessageDialog()
  },
  methods: {
    ShowMessageDialog () {
      dialog.showMessageBox({
        type: 'info',
        title: '访问说明',
        message: '你正在访问第三方DAPP',
        buttons: ['OK', 'Cancel']
      }).then(result => {
        console.log('您的选择:', result.response)
        console.log(result)
      }).catch(err => {
        console.log(err)
      })
    },

    init () {
      // ipcRenderer.on('confirmWindow', (confirmWindowInfo) => {
      //     this.viewInfo = confirmWindowInfo
      //   this.status = 0;
      // })
    },
    cancel () {
      this.status = 1
    },
    confirm () {
      this.status = 1
    },
    openUrl (urlType) {
      if (urlType === 'TokenLon') {
        // url = 'https://tokenlon.im'
        url = 'https://tokenlon.dev.tokenlon.im/#/'
        this.title = 'TokenLon'
        this.iconUrl = 'https://tokenlon.im/images/favico.png'
      }
      if (urlType === 'Sushiswap') {
        url = 'https://app.sushi.com/'
        this.title = 'Sushiswap'
        this.iconUrl = 'https://app.sushi.com/favicon.ico'
      }
      if (urlType === 'Uniswap') {
        url = 'https://app.uniswap.org/#/'
        this.title = 'Uniswap'
        this.iconUrl = 'https://app.uniswap.org/favicon.png'
      }
      if (urlType === 'PolkadotJS') {
        url = 'https://polkadot.js.org/apps/#/accounts'
        this.title = 'PolkadotJS'
        this.iconUrl = 'https://polkadot.js.org/favicon.ico'
      }
      if (urlType === 'Multisender') {
        url = 'https://multisender.app/'
        this.title = 'Multisender'
        this.iconUrl = 'https://multisender.app/favicon/favicon.ico'
      }
      if (urlType === 'Compound') {
        url = 'https://compound.finance/'
      }
      if (urlType === 'AAVE') {
        url = 'https://aave.com/'
      }
      ipcRenderer.send('openBrowserView', url, false)
      this.showToolBar = true
      this.showRightTools = true
    },
    closeDapp () {
      ipcRenderer.send('openBrowserView', 'close', true)
      this.showRightTools = false
    },
    showDapps () {
      ipcRenderer.send('openBrowserView', 'close', true)
      this.showToolBar = false
    },
    goForward () {
      ipcRenderer.send('goForward')
    },
    goBack () {
      ipcRenderer.send('goBack')
    },
    refresh () {
      ipcRenderer.send('refresh')
      document.getElementById('container2').blur()
    },
    copyLink () {
      ipcRenderer.send('copyLink', url)
      document.getElementById('container2').blur()
    },
    openInSafari () {
      ipcRenderer.send('openInSafari', url)
      document.getElementById('container2').blur()
    }
  }
}
</script>

<style scoped>
    .tool-bar{
        display: flex;
        background: #F7F7F7;
        height: 61px;
        width: calc(100vw - 300px);
        justify-content: space-between;
        /* visibility: hidden; */
    }
    .tool-bar .left-tools{
        display: flex;
        width: calc(100vw - 500px);
        align-items: center;
    }
.container2 {
  position: relative;
  top: -5px;
  /* width: 120px;
  margin: 100px auto; */
  display: none;
}
.container2:focus {
  outline: none;
}
.menu-list {
  width: 282px;
  display: none;
  background: #F4F5F6;
  position: absolute;
  left: 0;
  right: 0;
  line-height: 2;
  text-align: center;
  padding: 10px 0;
  border-radius:  26.5px;
  box-shadow: 0px 2px 20px rgba(46, 48, 53, 0.15);
}
.container2:focus .menu-list {
  display: block;
}
.menu-button {
  color: #fff;
  text-align: center;
  cursor: pointer;
}
.menu{
    display: flex;
    align-items: center;
    height: 60px;
    padding-left: 29px;
}
.menu:hover {
  background: #eee;
  cursor: pointer;
  user-selct: none;
  /* padding: 0 4px; */
}
    .tool-bar .right-tools{
        display: flex;
        align-items: center;
        width: 200px;
        background-image:
        url("data:image/svg+xml;utf8,<svg width='197' height='62' viewBox='0 0 197 62' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M0 12C0 5.37258 5.37258 0 12 0H185C191.627 0 197 5.37258 197 12V62H0V12Z' fill='white'/></svg>");
    }
    .right-tools p{
        font-family: PingFang SC;
        font-style: normal;
        font-weight: normal;
        font-size: 16px;
        line-height: 22px;
        display: flex;
        align-items: center;
        margin-left: 15px;

        /* Secondary text */
        color: #43454F;
    }
    .container{
        padding-left: 38px;
        font-family: PingFang SC;
    }
    .container h2{
        font-family: PingFang SC;
        font-style: normal;
        font-weight: 600;
        font-size: 15px;
        line-height: 21px;
        display: flex;
        align-items: center;

        color: #0E1019;
    }
    .container .appBox{
        margin-top: 33px;
        width: 900px;
        height: 99px;
        display: flex;
        flex-wrap: wrap;
    }
    .appBox .dapp{
        width: 400px;
        height: 64px;
        display: flex;
        align-items: flex-start;
        margin-bottom: 30px;
    }
    .dapp:hover{
        cursor: pointer;
    }
    .tool:hover{
        cursor: pointer;
    }
    .dapp .dapp-info{
        width: 280px;
        padding: 0 21px;
        display: flex;
        flex-direction: column;
        justify-items: flex-start;
    }
    .dapp .dapp-name{
        height: 20px;
        font-family: Noto Sans;
        font-style: normal;
        font-weight: 500;
        font-size: 17px;
        line-height: 23px;
        color: #11293B;
    }
    .dapp .dapp-desc{
        font-family: PingFang SC;
        font-size: 13px;
        line-height: 18px;
        color: #949EA6;
        margin-top: 7px;
    }
    /* .appBox .cbox{
        width: 240px;
        height: 99px;
        background: #5a3e3e;
        border-radius: 4px;
    }
    .appBox .cbox svg{
        margin-top: 23px;
        margin-left: 20px;
    }
    .appBox .cbox p{
        font-weight: 300;
        font-size: 13px;
        margin-left: 20px;
        width: 200px;
        height: 25px;
        color: #2E3035
    }
    .appBox .dbox{
        display: inline-block;
        margin-left: 40px;
        width: 240px;
        height: 99px;
        background: #FAFAFA;
        border-radius: 4px;
        vertical-align: middle;
        text-align: center;
    }
    .appBox .dbox .comingsoon {
        margin-top: 38px;
        margin-left: 10px;
        font-weight: 500;
        font-size: 13px;
        width: 200px;
        height: 25px;
        color: #979797;
        vertical-align: middle;
        text-align: center;
    }
    .appBox .dbox .leftLine {
        margin-top: 38px;
        font-size: 10px;
        line-height: 90px;
        width: 15px;
        height: 0.5px;
        color: #979797;
        vertical-align: middle;
        text-align: center;
    }
    .appBox .dbox .rightLine {
        margin-top: 38px;
        margin-left: 10px;
        font-size: 10px;
        width: 15px;
        height: 0.5px;
        color: #979797;
        vertical-align: middle;
        text-align: center;
    } */
    .statusBox{
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
    .statusBox svg{
        margin-bottom: 30px;
    }
    .statusBox p{
        font-size: 17px;
        color: #0E1019;
    }
    .status5Alert{
        width: 100%;
        height: 100%;
        position: fixed;
        left: 0;
        top: 0;
        background: rgba(0, 0, 0, 0.2);
    }
    .status5Alert .status5AlertBox{
        position: absolute;
        left: 50%;
        top: 50%;
        width: 500px;
        height: 288px;
        margin-left:-250px;
        margin-top:-144px;
        background: #FAFBFC;
        border-radius: 12px;
    }
    .status5AlertBox h4{
        font-weight: 500;
        font-size: 18px;
        color: #2C2842;
        margin-top:35px;
        margin-left: 35px;
    }
    .status5AlertBox p:nth-of-type(1){
        font-weight: 300;
        font-size: 13px;
        line-height: 30px;
        color: #2C2842;
        margin-top: 6px;
        margin-left: 35px;
        margin-bottom: 5px;
        justify-content: center;
    }
    .status5AlertBox p:nth-of-type(2), .status5AlertBox p:nth-of-type(3){
        font-weight: 300;
        font-size: 13px;
        color: #2C2842;
        padding-left: 35px;
        line-height: 30px;
        justify-content: center;
    }
    .status5AlertBox p{
        line-height: 30px;
        justify-content: center;
    }
   .status5Alert .status5AlertBox p svg{
        margin-right: 13px;
        vertical-align: middle;
        margin-bottom: 0;
    }
    .status5AlertBox p:nth-of-type(4){
        margin-top: 54px;
    }
    .cancel{
        margin-left: 250px;
        margin-top: 30px;
        width: 100px;
        height: 36px;
        border: 0.5px solid #000000;
        box-shadow: 0px 2px 20px rgba(137, 101, 172, 0.30772);
        border-radius: 26.5px;
        font-weight: 500;
        font-size: 14px;
        line-height: 32px;
    }
    .ok{
        margin-left: 15px;
        margin-top: 30px;
        background: #2E3035;
        box-shadow: 0px 2px 20px rgba(137, 101, 172, 0.30772);
        border-radius: 26.5px;
        width: 100px;
        height: 36px;
        color: #fff;
        font-weight: 500;
        font-size: 14px;
        line-height: 32px;
    }
</style>
