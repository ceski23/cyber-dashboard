## [1.2.1](https://github.com/ceski23/cyber-dashboard/compare/v1.2.0...v1.2.1) (2026-07-19)


### Bug Fixes

* regenerate config schema ([e6fddf1](https://github.com/ceski23/cyber-dashboard/commit/e6fddf10b281e331a1c0e20b971efe116230c63a))

# [1.2.0](https://github.com/ceski23/cyber-dashboard/compare/v1.1.1...v1.2.0) (2026-07-19)


### Features

* add Grafana widget ([65e11f2](https://github.com/ceski23/cyber-dashboard/commit/65e11f2c7c4a11b91b165fecf159585bd7dac2bb))
* improve widgets layout on mobile ([86f0324](https://github.com/ceski23/cyber-dashboard/commit/86f032495c368acc64887fd1ef0c1ad7591aa371))

## [1.1.1](https://github.com/ceski23/cyber-dashboard/compare/v1.1.0...v1.1.1) (2026-07-14)


### Bug Fixes

* fix container healthcheck ([9530195](https://github.com/ceski23/cyber-dashboard/commit/9530195a84d4682b2d26c3b7d95a23321709ca70))

# [1.1.0](https://github.com/ceski23/cyber-dashboard/compare/v1.0.0...v1.1.0) (2026-07-14)


### Features

* add healthcheck ([3592daa](https://github.com/ceski23/cyber-dashboard/commit/3592daa76fa428d97226668d042d48130195d81f))
* refactor config loader ([cba1242](https://github.com/ceski23/cyber-dashboard/commit/cba1242aa3cfb6574f107f955464ab2f25ba3ed5))
* use OAuth instead of API key for Tailscale widget ([ca7d552](https://github.com/ceski23/cyber-dashboard/commit/ca7d552790f4a3b95432203797ea4bd3171f853e))

# 1.0.0 (2026-07-09)


### Bug Fixes

* add cancelation to Cup data fetching ([9057e38](https://github.com/ceski23/cyber-dashboard/commit/9057e38a4cfb60e9e6acadc6188698f74296c717))
* fix building ([176027e](https://github.com/ceski23/cyber-dashboard/commit/176027ea084065dd3c27b7c9be39de391cb81130))
* fix Bun static files serving ([60890f9](https://github.com/ceski23/cyber-dashboard/commit/60890f91db2216177a5f215dc616ece492df9700))
* fix command palette light theme styles ([6d6238e](https://github.com/ceski23/cyber-dashboard/commit/6d6238ef8f7ef86bcfe0685dbb66c61360681441))
* fix command palette performance issue ([06750ab](https://github.com/ceski23/cyber-dashboard/commit/06750ab0d8dc8588fcf240b0fa65d99661e46e2a))
* fix config reloading ([2c1cf51](https://github.com/ceski23/cyber-dashboard/commit/2c1cf51139258210642821ed8f1d3dd04efb6543))
* fix cpu and memory widgets data fetching ([2936021](https://github.com/ceski23/cyber-dashboard/commit/2936021fcd454d20323a7b61a6ed6c5ee166a837))
* fix crashing widgets when refreshing config ([d8e97d7](https://github.com/ceski23/cyber-dashboard/commit/d8e97d712cbce175dd629b6d98ff6a42cc77a431))
* fix data fetching lags ([22dd4b0](https://github.com/ceski23/cyber-dashboard/commit/22dd4b02ed84d6e199ecd3ab4a8eb9ae83d5a000))
* fix Docker build ([db1c181](https://github.com/ceski23/cyber-dashboard/commit/db1c181d379f7b7e92c2d24555f4a7d452e283e6))
* fix issues with bundling date-fns ([08c5054](https://github.com/ceski23/cyber-dashboard/commit/08c5054c0ba9f9dabfcaa5d921f74e9ad33937ff))
* fix SSR ([1dbd767](https://github.com/ceski23/cyber-dashboard/commit/1dbd7674e2fc67a8dd712b1fe69e3466cb298847))
* fix storage utils not working in Docker image ([2c2ffa5](https://github.com/ceski23/cyber-dashboard/commit/2c2ffa5dfe3a3ce4a744e8d78b8ccf4d540d7a23))
* fix storage widget error handling ([646ac75](https://github.com/ceski23/cyber-dashboard/commit/646ac75f12ea1f9495799358740d8044e474db72))
* fix widgets error handling ([76657e4](https://github.com/ceski23/cyber-dashboard/commit/76657e42ac27d9a99d2a62002bc3c319194f3e3a))
* **memory:** update free memory display formatting ([b444710](https://github.com/ceski23/cyber-dashboard/commit/b44471078ed9078d3104365f19413227f172ef63))
* properly style active elements in command palette ([b2c3089](https://github.com/ceski23/cyber-dashboard/commit/b2c3089b46bdf228cac3bff10927a7a4f8cf4ff2))
* restore version of Tanstack Start with working serverFns ([079a725](https://github.com/ceski23/cyber-dashboard/commit/079a7257a85d5e8b16cc7c95930216c168ef7df4))
* **serviceLink:** update status handling for service states ([f32068b](https://github.com/ceski23/cyber-dashboard/commit/f32068bbaab217069aab45108524d6e49dbbd929))


### Features

* add Blocky widget ([66492e8](https://github.com/ceski23/cyber-dashboard/commit/66492e8f16380d6128f9d246e4f4d3d1f163f6be))
* add Cup widget ([970ce82](https://github.com/ceski23/cyber-dashboard/commit/970ce82ef4157304360ba19962bfd54b2961501b))
* add Docker deployment ([be2989d](https://github.com/ceski23/cyber-dashboard/commit/be2989d387de21efff6df7eebde334ae4a5605ff))
* add first sample widgets ([af8db77](https://github.com/ceski23/cyber-dashboard/commit/af8db778bac99831a051e753b8142786c1652d0e))
* add Gatus widget ([f6e03e4](https://github.com/ceski23/cyber-dashboard/commit/f6e03e48a58de7c20716093a481633303a18a7e1))
* add grouping of widgets ([53a80bc](https://github.com/ceski23/cyber-dashboard/commit/53a80bc4fc649b02bb1bdfb79fbad5dbd09c0067))
* add light theme and theme detection ([fe02c8c](https://github.com/ceski23/cyber-dashboard/commit/fe02c8ca27f6f20ddf8d1ffdd0915679b79930e2))
* add links to cards header ([7b0b2b4](https://github.com/ceski23/cyber-dashboard/commit/7b0b2b41872ce78d4e06a40514606dac74d8370d))
* add logging ([d3a8108](https://github.com/ceski23/cyber-dashboard/commit/d3a81083f0200252ed43a1448a7c668f983f2efe))
* add open-meteo weather and air quality widgets ([c1b4881](https://github.com/ceski23/cyber-dashboard/commit/c1b488189731859fd1789d681cbe0106a847efd6))
* add ping status provider ([d0f8b6c](https://github.com/ceski23/cyber-dashboard/commit/d0f8b6c0d7da7802403f604f5913167b5c9a2a61))
* add Proxmox widget ([80347e8](https://github.com/ceski23/cyber-dashboard/commit/80347e8109b445fc9457c925821e16c1a58fe112))
* add redirect for invalid routes ([46c2aa1](https://github.com/ceski23/cyber-dashboard/commit/46c2aa1f98630e85219957aa23b4dd31112cb37d))
* add service status providers ([898d7cf](https://github.com/ceski23/cyber-dashboard/commit/898d7cf759df81dab764057252728615e623dd65))
* add Skeleton component ([4fb191c](https://github.com/ceski23/cyber-dashboard/commit/4fb191c5cf9fb23722849d0248a1a599f64ca73e))
* add storage widget ([e88bbaa](https://github.com/ceski23/cyber-dashboard/commit/e88bbaa49ace788387e5ccd773e1870277ad9402))
* add Tailscale widget ([a1f8c35](https://github.com/ceski23/cyber-dashboard/commit/a1f8c356fdaea6b54a7ec0cbba37fd86bf969ae5))
* add Traefik widget ([0183138](https://github.com/ceski23/cyber-dashboard/commit/0183138af03da74ce235ed5feb7cf0b94d55a821))
* add unavailable endpoints list tooltip to Gatus widget ([ba7785f](https://github.com/ceski23/cyber-dashboard/commit/ba7785fef22ab3514e5cc4b0a145a35a4c9b93e7))
* add weather icon ([b265ea7](https://github.com/ceski23/cyber-dashboard/commit/b265ea7a28f2cd5b6cac38d7e21dbf06610e8dee))
* add widgets stacks ([db74fbb](https://github.com/ceski23/cyber-dashboard/commit/db74fbbdff0ba2df1dac29a1b3004720255c1828))
* AI guidelines ([4057821](https://github.com/ceski23/cyber-dashboard/commit/4057821223e3417a0ac8e204cef354b32364beea))
* better config loader with support for multiple file formats and _FILE suffix for envs ([c0137f0](https://github.com/ceski23/cyber-dashboard/commit/c0137f03919f8054f2ab3a38eda4c55c655ca9a9))
* command palette with services links ([695eeb8](https://github.com/ceski23/cyber-dashboard/commit/695eeb876de92b168cc894c95510aa37eb87461e))
* improve app background ([0eced71](https://github.com/ceski23/cyber-dashboard/commit/0eced71e66417168c76d154789759405dec96c3c))
* improve command palette animations ([e669c35](https://github.com/ceski23/cyber-dashboard/commit/e669c35eb9fc2529a40014e1665b2da8af86d7df))
* improve config reloading ([4cb9c18](https://github.com/ceski23/cyber-dashboard/commit/4cb9c182e05088a8b8ecf9cb078365f9f0ad4a42))
* improve cpu widget styles ([edabff1](https://github.com/ceski23/cyber-dashboard/commit/edabff1b0fe5666bfca4f595114e6349b57f3cc8))
* improve data preloading ([40ec849](https://github.com/ceski23/cyber-dashboard/commit/40ec84920f8f342eddbdcd2fc8c3d7cabc552324))
* improve Docker container ([c16d21a](https://github.com/ceski23/cyber-dashboard/commit/c16d21a3f9b69b4bdb49528422027777f5d6bd17))
* improve Gatus widget ([16f0c0d](https://github.com/ceski23/cyber-dashboard/commit/16f0c0d120adb9c5d849f817b87325c9c2838a26))
* improve general responsiveness ([f31d8a8](https://github.com/ceski23/cyber-dashboard/commit/f31d8a8601a52a84add3322860a00e00f4886450))
* improve grid styles ([68210b8](https://github.com/ceski23/cyber-dashboard/commit/68210b8d3a5c220005dd70683f59edb7049257a9))
* improve keyboard shortcuts handling ([c953eb3](https://github.com/ceski23/cyber-dashboard/commit/c953eb3d1d49c23ebf2a450b54f05e12c1d227ef))
* improve ping status provider ([1791aa1](https://github.com/ceski23/cyber-dashboard/commit/1791aa11552485da061d4abea74ea99af5503e16))
* improve service link widget design ([b425d2b](https://github.com/ceski23/cyber-dashboard/commit/b425d2b72ebfd12ca058a12693c93aade4d142ad))
* improve service widget styles ([d777d99](https://github.com/ceski23/cyber-dashboard/commit/d777d99d3e68150a406b78920ed6ada753606ba9))
* improve stat formatting in weather widget ([9623def](https://github.com/ceski23/cyber-dashboard/commit/9623def37cc04d5be6d997e1262576473056e4f6))
* improve styles ([1f7a0fa](https://github.com/ceski23/cyber-dashboard/commit/1f7a0fa1b94f5cb9b7ddbd9f297ab8a2b43a2583))
* improve styles ([e419579](https://github.com/ceski23/cyber-dashboard/commit/e4195790624cee651f2696bb27c6e3e452a7dcbb))
* improve styles when widget errors ([cead75c](https://github.com/ceski23/cyber-dashboard/commit/cead75c69460d5a99d8c14fff4b825cb438c2aad))
* improve system data detection ([88cde09](https://github.com/ceski23/cyber-dashboard/commit/88cde0992f92f814a83c6f0ca468154b7a326b72))
* improve tooltip position in Gatus widget ([da832c1](https://github.com/ceski23/cyber-dashboard/commit/da832c126eadc1a92c4005c7626dd9fa02af4334))
* improve weather widget styles ([69667ab](https://github.com/ceski23/cyber-dashboard/commit/69667abe5fced2e8cc150681aef1d049f0b60e88))
* init ([19c78a5](https://github.com/ceski23/cyber-dashboard/commit/19c78a586a528e57a34df58b063c43ec1cc8d965))
* layout, header and command palette styles ([7f741cf](https://github.com/ceski23/cyber-dashboard/commit/7f741cf08e7c1df911618363e66900711f3d957b))
* migrate to vite+ ([789af45](https://github.com/ceski23/cyber-dashboard/commit/789af45785d89ebdaef37b4dc83c276f8ab764f7))
* nicer CPU chart design ([beafde3](https://github.com/ceski23/cyber-dashboard/commit/beafde3cc990cee4b88bf7c9f5184acf8ea247fc))
* refactor Air Quality and Weather widgets ([8d8f326](https://github.com/ceski23/cyber-dashboard/commit/8d8f326c71120378249d75fe45cf7c200d19e047))
* refactor secrets injection ([ee6a703](https://github.com/ceski23/cyber-dashboard/commit/ee6a703bcefa6465ba682635baeb0cd8e7dd365e))
* remove old auth, support OAuth 2.0 Bearer Token for requests authorization ([701e024](https://github.com/ceski23/cyber-dashboard/commit/701e02465fd30c0fd091afdd79935731b9f39a0e))
* remove useless title and description params from all widgets ([ac676b8](https://github.com/ceski23/cyber-dashboard/commit/ac676b8c12dc795aaeaf4c0c99f365b19fdb0e17))
* replace clsx ([06aa68c](https://github.com/ceski23/cyber-dashboard/commit/06aa68cf397d40275920151709e1ea00b5356524))
* restyle memory widget ([6abb878](https://github.com/ceski23/cyber-dashboard/commit/6abb8786bc775e0b08a2bcb63b894c5bcf592850))
* **storage:** enhance storage widget with status glow effect ([9563c0c](https://github.com/ceski23/cyber-dashboard/commit/9563c0c84762d247cf2e1f60aab7d6bcd95e927c))
* style cpu load widget ([37083d2](https://github.com/ceski23/cyber-dashboard/commit/37083d2a9c63f63dece90a3f000c1fd533d832d2))
* style cpu widget ([05819fc](https://github.com/ceski23/cyber-dashboard/commit/05819fc1c766f1f7ba1db2ce0e54e1950f16e104))
* style service link widget ([dd8aba1](https://github.com/ceski23/cyber-dashboard/commit/dd8aba1f07e5061e178888853ec46052f5bad2c3))
* style storage widget ([6b791bf](https://github.com/ceski23/cyber-dashboard/commit/6b791bfb43d41dbd3f804ecbd8b7143d5adc7c3d))
* style weather and air quality widgets ([20a3446](https://github.com/ceski23/cyber-dashboard/commit/20a344632943ae39086313ef9325bd3ddacc4913))
* style weather widgets ([f039aa8](https://github.com/ceski23/cyber-dashboard/commit/f039aa8128682c661130f251b9b5fef4f267747d))
* unify badge component ([b81b6d8](https://github.com/ceski23/cyber-dashboard/commit/b81b6d812a4e4c60eadfb4277242948df0beb3be))
* unify widgets design ([bdd33ee](https://github.com/ceski23/cyber-dashboard/commit/bdd33eebeaae794449084c3127df9d77e767047d))
* unify widgets look ([bd96df6](https://github.com/ceski23/cyber-dashboard/commit/bd96df6abf51e6899d09846b90d3491b9d7719b4))
* update outline color ([9e81aba](https://github.com/ceski23/cyber-dashboard/commit/9e81abae80117badb33868cccd76ee355249f792))
* use experimental Vite and TSGO ([6b370fe](https://github.com/ceski23/cyber-dashboard/commit/6b370fe87fc7f44260d2a37e43c846839e8a265a))
* use nodejs sub-imports ([9cc88b7](https://github.com/ceski23/cyber-dashboard/commit/9cc88b72a5ce158939e38fad3c3060f23c43df8b))
* use Tanstack Hotkeys ([eb7329e](https://github.com/ceski23/cyber-dashboard/commit/eb7329e2e5c5a5e7ab899c32354db2bb35fc15f9))
* validate config on app start ([73f1dc1](https://github.com/ceski23/cyber-dashboard/commit/73f1dc1fc23d51f74de8e84219e2a7a9db231618))
