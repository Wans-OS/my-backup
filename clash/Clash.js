/**
 * 个人备份使用，该脚本适用与Mihomo Party和 Clash Verge Rev
 * Clash Verge Rev 全局扩展脚本（懒人配置）/ Mihomo Party 覆写脚本
 * URL: https://github.com/Wans-OS/my-backup
 */

// 多订阅合并，这里添加额外的地址
const proxyProviders = {
  "p1": {
    "type": "http",
    // 订阅 链接
    "url": "https://baidu.com",
    // 自动更新时间 86400(秒) / 3600 = 24小时
    "interval": 86400,
    "override": {
      // 节点名称前缀 p1，用于区别机场节点
      "additional-prefix": "p1 |"
    }
  },
  "p2": {
    "type": "http",
    "url": "https://google.com",
    "interval": 86400,
    "override": {
      "additional-prefix": "p2 |"
    }
  },
}

// 程序入口
function main(config) {
  const proxyCount = config?.proxies?.length ?? 0;
  const originalProviders = config?.["proxy-providers"] || {};
  const proxyProviderCount = typeof originalProviders === "object" ? Object.keys(originalProviders).length : 0;

  if (proxyCount === 0 && proxyProviderCount === 0) {
    throw new Error("配置文件中未找到任何代理");
  }

  // 合并而非覆盖
  config["proxy-providers"] = {
    ...originalProviders,  // 保留原有配置
    ...proxyProviders       // 合并新配置（同名则覆盖）
  };
  // 覆盖原配置中DNS配置
  config["dns"] = dnsConfig;
  // 覆盖原配置中的代理组
  config["proxy-groups"] = proxyGroupConfig;
  // 覆盖原配置中的规则
  config["rule-providers"] = ruleProviders;
  config["rules"] = rules;
  // 覆盖通用配置
  config["mode"] = "rule";
  config["mixed-port"] = 7890;
  config["allow-lan"] = true;
  config["bind-address"] = "*";
  config["ipv6"] = false;
  config["log-level"] = "warning";
  config["unified-delay"] = true;
  config["find-process-mode"] = "strict";
  config["tcp-concurrent"] = true;
  config["keep-alive-interval"] = 15;
  config["keep-alive-idle"] = 600;
  // 规则选择缓存
  config["profile"] = {
    "store-selected": true,
    "store-fake-ip": true,
    "tracing": true
  };
  // GEO配置
  config["geodata-mode"] = false;
  config["geo-auto-update"] = true;
  config["geo-update-interval"] = 24;
  config["geodata-loader"] = "memconservative";
  config["geox-url"] = {
    "geoip": "https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release/geoip.dat",
    "mmdb": "https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release/country.mmdb",
    "geosite": "https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release/geosite.dat",
    "asn": "https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release/GeoLite2-ASN.mmdb"
  };
  // 嗅探
  config["sniffer"] = snifferConfig;
  // 实验性功能
  config["experimental"] = {
    "quic-go-disable-gso": true,
    "sniff-tls-sni": true
  };
  // 返回修改后的配置
  return config;
}

// 测速地址
const UrlTest = "https://www.gstatic.com/generate_204";

// DNS配置
const dnsConfig = {
  "enable": true,
  "ipv6": true,
  "prefer-h3": false,
  "use-hosts": true,
  "listen": "0.0.0.0:1053",
  "use-system-hosts": true,
  "respect-rules": true,
  "enhanced-mode": "fake-ip",
  "fake-ip-range": "198.18.0.1/16",
  "fake-ip-range6": "fdfe:dcba:9876::/64",
  "fake-ip-filter": [
    "RULE-SET:Lan",
    "RULE-SET:China"
  ],
  "fallback": [
    "https://dns.adguard-dns.com/dns-query#ecs=1.1.1.1/24&ecs-override=true",
    "https://dns.cloudflare.com/dns-query#ecs=1.1.1.1/24&ecs-override=true",
    "https://dns.google/dns-query#ecs=1.1.1.1/24&ecs-override=true"
  ],
  "direct-nameserver-follow-policy": true,
  "default-nameserver": [
    "tls://223.5.5.5",
    "tls://119.29.29.29"
  ],
  "nameserver": [
    "https://dns.adguard-dns.com/dns-query#ecs=1.1.1.1/24&ecs-override=true",
    "https://dns.cloudflare.com/dns-query#ecs=1.1.1.1/24&ecs-override=true",
    "https://dns.google/dns-query#ecs=1.1.1.1/24&ecs-override=true"
  ],
  "nameserver-policy": {
    "RULE-SET:China,Lan": [
      "https://dns.alidns.com/dns-query#ecs=223.5.5.5/24&ecs-override=true",
      "https://doh.pub/dns-query#ecs=223.5.5.5/24&ecs-override=true"
    ]
  },
  "proxy-server-nameserver": [
    "https://dns.alidns.com/dns-query#ecs=223.5.5.5/24&ecs-override=true",
    "https://doh.pub/dns-query#ecs=223.5.5.5/24&ecs-override=true"
  ],
  "proxy-server-nameserver-policy": {
    "*.digital-nvme.com": [
      "8.138.94.132:8053"
    ]
  }
};

// 嗅探配置
const snifferConfig = {
  "enable": true,
  "parse-pure-ip": true,
  "override-destination": true,
  "sniff": {
    "TLS": { "ports": [443, 8443] },
    "HTTP": { "ports": [80, "8080-8880"], "override-destination": true },
    "QUIC": { "ports": [443, 8443] }
  },
  "skip-domain": [
    "Mijia Cloud",
    "+.push.apple.com"
  ]
};

// 节点筛选锚点
const FilterHK = "(?i)(?=.*(🇭🇰|香港|港|hk|hkg|hong ?kong))";
const FilterTW = "(?i)(?=.*(🇹🇼|台湾|台|TW|TWN|taiwan|taipei))";
const FilterSG = "(?i)(?=.*(🇸🇬|新加坡|狮城|新|SG|SGP|singapore))";
const FilterJP = "(?i)(?=.*(🇯🇵|日本|日|JP|JPN|japan|tokyo|osaka))";
const FilterKR = "(?i)(?=.*(🇰🇷|韩国|韩|KR|KOR|korea|seoul))";
const FilterUS = "(?i)(?=.*(🇺🇸|美国|美|US|USA|united ?states|america|los angeles|san jose|silicon valley))";
const FilterUK = "(?i)(?=.*(🇬🇧|英国|英|GBR|UK|united ?kingdom|london))";
const FilterHM = "(?i)(?=.*(家宽))";

// 代理组地区配置锚点
const BaseUT = { "interval": 300, "lazy": true, "url": UrlTest, "hidden": true, "include-all": true, "type": "url-test" };
const BaseFB = { "interval": 300, "lazy": true, "url": UrlTest, "hidden": true, "include-all": true, "type": "fallback" };
const BaseCR = { "interval": 300, "lazy": true, "url": UrlTest, "hidden": true, "include-all": true, "type": "load-balance", "strategy": "round-robin" };
const BaseCH = { "interval": 300, "lazy": true, "url": UrlTest, "hidden": true, "include-all": true, "type": "load-balance", "strategy": "consistent-hashing" };

// 代理组锚点
const SelectUL = {
  "type": "select",
  "include-all": true,
  "proxies": ["香港自动", "家宽选择", "台湾自动", "狮城自动", "日本自动", "韩国自动", "美国自动", "英国自动", "香港-回退", "香港均衡-散列", "香港均衡-轮询", "台湾-回退", "台湾均衡-散列", "台湾均衡-轮询", "狮城-回退", "狮城均衡-散列", "狮城均衡-轮询", "日本-回退", "日本均衡-散列", "日本均衡-轮询", "韩国-回退", "韩国均衡-散列", "韩国均衡-轮询", "美国-回退", "美国均衡-散列", "美国均衡-轮询", "英国-回退", "英国均衡-散列", "英国均衡-轮询", "DIRECT", "REJECT"]
};
const SelectTW = {
  "type": "select",
  "include-all": true,
  "proxies": ["台湾自动", "手动选择", "香港自动", "狮城自动", "日本自动", "韩国自动", "美国自动", "香港-回退", "香港均衡-散列", "香港均衡-轮询", "台湾-回退", "台湾均衡-散列", "台湾均衡-轮询", "狮城-回退", "狮城均衡-散列", "狮城均衡-轮询", "日本-回退", "日本均衡-散列", "日本均衡-轮询", "韩国-回退", "韩国均衡-散列", "韩国均衡-轮询", "美国-回退", "美国均衡-散列", "美国均衡-轮询", "英国-回退", "英国均衡-散列", "英国均衡-轮询", "DIRECT", "REJECT"]
};
const SelectUS = {
  "type": "select",
  "include-all": true,
  "proxies": ["美国自动", "手动选择", "香港自动", "台湾自动", "狮城自动", "日本自动", "韩国自动", "香港-回退", "香港均衡-散列", "香港均衡-轮询", "台湾-回退", "台湾均衡-散列", "台湾均衡-轮询", "狮城-回退", "狮城均衡-散列", "狮城均衡-轮询", "日本-回退", "日本均衡-散列", "日本均衡-轮询", "韩国-回退", "韩国均衡-散列", "韩国均衡-轮询", "美国-回退", "美国均衡-散列", "美国均衡-轮询", "英国-回退", "英国均衡-散列", "英国均衡-轮询", "DIRECT", "REJECT"]
};
const SelectSG = {
  "type": "select",
  "include-all": true,
  "proxies": ["狮城自动", "手动选择", "香港自动", "台湾自动", "日本自动", "韩国自动", "美国自动", "香港-回退", "香港均衡-散列", "香港均衡-轮询", "台湾-回退", "台湾均衡-散列", "台湾均衡-轮询", "狮城-回退", "狮城均衡-散列", "狮城均衡-轮询", "日本-回退", "日本均衡-散列", "日本均衡-轮询", "韩国-回退", "韩国均衡-散列", "韩国均衡-轮询", "美国-回退", "美国均衡-散列", "美国均衡-轮询", "英国-回退", "英国均衡-散列", "英国均衡-轮询", "DIRECT", "REJECT"]
};
const SelectSL = {
  "type": "select",
  "include-all": true,
  "proxies": ["手动选择", "香港自动", "台湾自动", "狮城自动", "日本自动", "韩国自动", "美国自动", "香港-回退", "香港均衡-散列", "香港均衡-轮询", "台湾-回退", "台湾均衡-散列", "台湾均衡-轮询", "狮城-回退", "狮城均衡-散列", "狮城均衡-轮询", "日本-回退", "日本均衡-散列", "日本均衡-轮询", "韩国-回退", "韩国均衡-散列", "韩国均衡-轮询", "美国-回退", "美国均衡-散列", "美国均衡-轮询", "英国-回退", "英国均衡-散列", "英国均衡-轮询", "DIRECT", "REJECT"]
};

// 代理组
const proxyGroupConfig = [
  { "name": "手动选择", ...SelectUL, "icon": "https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/Rocket.png" },
  { "name": "家宽选择", ...BaseFB, "filter": FilterHM, "hidden": false, "icon": "https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/Hong_Kong.png" },
  { "name": "GLOBAL", ...SelectSL, "icon": "https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/Global.png" },

  // ===================== AI大模型 =====================
  { "name": "Claude", ...SelectSL, "icon": "https://fastly.jsdelivr.net/gh/lobehub/lobe-icons@master/packages/static-png/light/claude-color.png" },
  { "name": "Gemini", ...SelectSG, "icon": "https://fastly.jsdelivr.net/gh/lobehub/lobe-icons@master/packages/static-png/light/gemini-color.png", "url": "https://www.google.com/generate_204" },
  { "name": "OpenAI", ...SelectUS, "icon": "https://fastly.jsdelivr.net/gh/lobehub/lobe-icons@master/packages/static-png/light/openai.png" },

  // ===================== 媒体 & 娱乐 =====================
  { "name": "Apple", ...SelectSL, "icon": "https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/Apple.png", "url": "https://www.apple.com/library/test/success.html" },
  { "name": "Disney", ...SelectSL, "icon": "https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/Disney.png" },
  { "name": "Netflix", ...SelectSL, "icon": "https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/Netflix.png" },
  { "name": "Spotify", ...SelectSL, "icon": "https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/Spotify.png" },
  { "name": "TikTok", ...SelectTW, "icon": "https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/TikTok.png" },
  { "name": "YouTube", ...SelectSL, "icon": "https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/YouTube.png", "url": "https://www.youtube.com/generate_204" },

  // ===================== 生产力 & 常用 =====================
  { "name": "Emby", ...SelectSL, "icon": "https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/Emby.png" },
  { "name": "Github", ...SelectSL, "icon": "https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/GitHub.png" },
  { "name": "Google", ...SelectSL, "icon": "https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/Google_Search.png", "url": "https://www.google.com/generate_204" },
  { "name": "Microsoft", ...SelectSL, "icon": "https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/Microsoft.png", "url": "http://www.msftconnecttest.com/connecttest.txt" },
  { "name": "OneDrive", ...SelectSL, "icon": "https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/OneDrive.png" },

  // ===================== 社交 & 即时通讯 =====================
  { "name": "Twitter(X)", ...SelectSL, "icon": "https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/Twitter(X).png" },
  { "name": "Telegram", ...SelectSL, "icon": "https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/Telegram.png" },
  { "name": "WhatsApp", ...SelectSL, "icon": "https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/WhatsApp.png" },

  // ===================== 游戏 & 下载 =====================
  { "name": "Steam", ...SelectSL, "icon": "https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/Steam.png" },

  // ===================== 地区分组(自动测速+隐藏) =====================
  { "name": "香港自动", ...BaseUT, "filter": FilterHK, "icon": "https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/Hong_Kong.png" },
  { "name": "台湾自动", ...BaseUT, "filter": FilterTW, "icon": "https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/Taiwan.png" },
  { "name": "狮城自动", ...BaseUT, "filter": FilterSG, "icon": "https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/Singapore.png" },
  { "name": "日本自动", ...BaseUT, "filter": FilterJP, "icon": "https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/Japan.png" },
  { "name": "韩国自动", ...BaseUT, "filter": FilterKR, "icon": "https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/Korea.png" },
  { "name": "美国自动", ...BaseUT, "filter": FilterUS, "icon": "https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/United_States.png" },
  { "name": "英国自动", ...BaseUT, "filter": FilterUK, "icon": "https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/United_Kingdom.png" },

  // ===================== 地区分组 (回退) =====================
  { "name": "香港-回退", ...BaseFB, "filter": FilterHK, "icon": "https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/Hong_Kong.png" },
  { "name": "台湾-回退", ...BaseFB, "filter": FilterTW, "icon": "https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/Taiwan.png" },
  { "name": "狮城-回退", ...BaseFB, "filter": FilterSG, "icon": "https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/Singapore.png" },
  { "name": "日本-回退", ...BaseFB, "filter": FilterJP, "icon": "https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/Japan.png" },
  { "name": "韩国-回退", ...BaseFB, "filter": FilterKR, "icon": "https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/Korea.png" },
  { "name": "美国-回退", ...BaseFB, "filter": FilterUS, "icon": "https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/United_States.png" },
  { "name": "英国-回退", ...BaseFB, "filter": FilterUK, "icon": "https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/United_Kingdom.png" },

  // ===================== 地区分组(负载均衡-散列) =====================
  { "name": "香港均衡-散列", ...BaseCH, "filter": FilterHK, "icon": "https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/Hong_Kong.png" },
  { "name": "台湾均衡-散列", ...BaseCH, "filter": FilterTW, "icon": "https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/Taiwan.png" },
  { "name": "狮城均衡-散列", ...BaseCH, "filter": FilterSG, "icon": "https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/Singapore.png" },
  { "name": "日本均衡-散列", ...BaseCH, "filter": FilterJP, "icon": "https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/Japan.png" },
  { "name": "韩国均衡-散列", ...BaseCH, "filter": FilterKR, "icon": "https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/Korea.png" },
  { "name": "美国均衡-散列", ...BaseCH, "filter": FilterUS, "icon": "https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/United_States.png" },
  { "name": "英国均衡-散列", ...BaseCH, "filter": FilterUK, "icon": "https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/United_Kingdom.png" },

  // ===================== 地区分组 (负载均衡-轮询) =====================
  { "name": "香港均衡-轮询", ...BaseCR, "filter": FilterHK, "icon": "https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/Hong_Kong.png" },
  { "name": "台湾均衡-轮询", ...BaseCR, "filter": FilterTW, "icon": "https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/Taiwan.png" },
  { "name": "狮城均衡-轮询", ...BaseCR, "filter": FilterSG, "icon": "https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/Singapore.png" },
  { "name": "日本均衡-轮询", ...BaseCR, "filter": FilterJP, "icon": "https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/Japan.png" },
  { "name": "韩国均衡-轮询", ...BaseCR, "filter": FilterKR, "icon": "https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/Korea.png" },
  { "name": "美国均衡-轮询", ...BaseCR, "filter": FilterUS, "icon": "https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/United_States.png" },
  { "name": "英国均衡-轮询", ...BaseCR, "filter": FilterUK, "icon": "https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/United_Kingdom.png" }
];

// 规则集行为锚点
const BehaviorDN = { "type": "http", "interval": 86400, "format": "mrs", "behavior": "domain" };
const BehaviorIP = { "type": "http", "interval": 86400, "format": "mrs", "behavior": "ipcidr" };
const BehaviorCL = { "type": "http", "interval": 86400, "format": "yaml", "behavior": "classical" };

// 规则集配置
const ruleProviders = {
  // 域名规则集
  "category-ads-all": { ...BehaviorDN, "url": "https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/category-ads-all.mrs" },
  "Apple": { ...BehaviorDN, "url": "https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/apple@cn.mrs" },
  "China": { ...BehaviorDN, "url": "https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/cn.mrs" },
  "Claude": { ...BehaviorDN, "url": "https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/anthropic.mrs" },
  "Disney": { ...BehaviorDN, "url": "https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/disney.mrs" },
  "Emby": { ...BehaviorDN, "url": "https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/category-emby.mrs" },
  "Gemini": { ...BehaviorDN, "url": "https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/google-gemini.mrs" },
  "Github": { ...BehaviorDN, "url": "https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/github.mrs" },
  "Google": { ...BehaviorDN, "url": "https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/google.mrs" },
  "Lan": { ...BehaviorDN, "url": "https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/private.mrs" },
  "Microsoft": { ...BehaviorDN, "url": "https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/microsoft.mrs" },
  "Netflix": { ...BehaviorDN, "url": "https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/netflix.mrs" },
  "OpenAI": { ...BehaviorDN, "url": "https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/openai.mrs" },
  "OneDrive": { ...BehaviorDN, "url": "https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/onedrive.mrs" },
  "Steam": { ...BehaviorDN, "url": "https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/steam.mrs" },
  "Spotify": { ...BehaviorDN, "url": "https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/spotify.mrs" },
  "TikTok": { ...BehaviorDN, "url": "https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/tiktok.mrs" },
  "WhatsApp": { ...BehaviorDN, "url": "https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/whatsapp.mrs" },
  "Twitter": { ...BehaviorDN, "url": "https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/x.mrs" },
  "Telegram": { ...BehaviorDN, "url": "https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/telegram.mrs" },
  "YouTube": { ...BehaviorDN, "url": "https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/youtube.mrs" },
  "DNSLeak": { ...BehaviorDN, "url": "https://fastly.jsdelivr.net/gh/0xWans/my-backup@main/clash/rules/DNSLeak.mrs" },

  // IP规则集
  "ChinaIP": { ...BehaviorIP, "url": "https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geoip/cn.mrs" },
  "GoogleIP": { ...BehaviorIP, "url": "https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geoip/google.mrs" },
  "LanIP": { ...BehaviorIP, "url": "https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geoip/private.mrs" },
  "NetflixIP": { ...BehaviorIP, "url": "https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geoip/netflix.mrs" },
  "TwitterIP": { ...BehaviorIP, "url": "https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geoip/twitter.mrs" },
  "TelegramIP": { ...BehaviorIP, "url": "https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geoip/telegram.mrs" },

  // 应用规则集
  "ChinaAPP": { ...BehaviorCL, "url": "https://fastly.jsdelivr.net/gh/0xWans/my-backup@main/clash/rules/Process/ChinaAPP.yaml" },
  "Direct": { ...BehaviorDN, "url": "https://fastly.jsdelivr.net/gh/0xWans/my-backup@main/clash/rules/Direct.mrs" }
};

// 规则
const rules = [
  // 自定义规则集
  "RULE-SET,Direct,DIRECT",
  "AND,((DST-PORT,443),(NETWORK,UDP),(NOT,((RULE-SET,ChinaIP))),(NOT,((RULE-SET,China)))),REJECT",

  // 应用规则集
  "RULE-SET,ChinaAPP,DIRECT",

  // 域名规则集-按照优先级顺序排列
  "RULE-SET,category-ads-all,REJECT",
  "RULE-SET,YouTube,YouTube",
  "RULE-SET,Github,Github",
  "RULE-SET,OpenAI,OpenAI",
  "RULE-SET,Gemini,Gemini",
  "RULE-SET,Google,Google",
  "RULE-SET,Apple,Apple",
  "RULE-SET,Claude,Claude",
  "RULE-SET,Twitter,Twitter(X)",
  "RULE-SET,Telegram,Telegram",
  "RULE-SET,Spotify,Spotify",
  "RULE-SET,TikTok,TikTok",
  "RULE-SET,WhatsApp,WhatsApp",
  "RULE-SET,OneDrive,OneDrive",
  "RULE-SET,Microsoft,Microsoft",
  "RULE-SET,Netflix,Netflix",
  "RULE-SET,Disney,Disney",
  "RULE-SET,Steam,Steam",
  "RULE-SET,Emby,Emby",
  "RULE-SET,Lan,DIRECT",
  "RULE-SET,China,DIRECT",

  // IP规则集-按照优先级顺序排列
  "RULE-SET,LanIP,DIRECT,no-resolve",
  "RULE-SET,ChinaIP,DIRECT,no-resolve",
  "RULE-SET,GoogleIP,Google,no-resolve",
  "RULE-SET,TelegramIP,Telegram,no-resolve",
  "RULE-SET,TwitterIP,Twitter(X),no-resolve",

  // 默认规则集
  "MATCH,手动选择"
];
