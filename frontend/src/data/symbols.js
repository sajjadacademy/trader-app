export const ALL_SYMBOLS = [
    // Majors
    { symbol: 'EURUSD', description: 'Euro vs US Dollar', group: 'Forex', bid: 1.16367, ask: 1.16369, spread: 2, low: 1.16180, high: 1.16621, changePoint: -226, changePercent: -0.19, digits: 5 },
    { symbol: 'GBPUSD', description: 'Great Britain Pound vs US Dollar', group: 'Forex', bid: 1.33991, ask: 1.34042, spread: 51, low: 1.33922, high: 1.34504, changePoint: -433, changePercent: -0.32, digits: 5 },
    { symbol: 'USDJPY', description: 'US Dollar vs Japanese Yen', group: 'Forex', bid: 149.501, ask: 149.532, spread: 31, low: 149.200, high: 149.800, changePoint: 105, changePercent: 0.67, digits: 3 },
    { symbol: 'USDCHF', description: 'US Dollar vs Swiss Franc', group: 'Forex', bid: 0.89098, ask: 0.89159, spread: 61, low: 0.88764, high: 0.89171, changePoint: 218, changePercent: 0.27, digits: 5 },
    { symbol: 'AUDUSD', description: 'Australian Dollar vs US Dollar', group: 'Forex', bid: 0.66683, ask: 0.66916, spread: 83, low: 0.66634, high: 0.67038, changePoint: -156, changePercent: -0.23, digits: 5 },
    { symbol: 'USDCAD', description: 'US Dollar vs Canadian Dollar', group: 'Forex', bid: 1.36500, ask: 1.36530, spread: 30, low: 1.36200, high: 1.36800, changePoint: 50, changePercent: 0.04, digits: 5 },
    { symbol: 'NZDUSD', description: 'New Zealand Dollar vs US Dollar', group: 'Forex', bid: 0.57269, ask: 0.57359, spread: 90, low: 0.57108, high: 0.57530, changePoint: -253, changePercent: -0.44, digits: 5 },

    // Minors
    { symbol: 'EURGBP', description: 'Euro vs Great Britain Pound', group: 'Forex', bid: 0.86540, ask: 0.86560, spread: 20, low: 0.86400, high: 0.86700, changePoint: 12, changePercent: 0.05, digits: 5 },
    { symbol: 'EURJPY', description: 'Euro vs Japanese Yen', group: 'Forex', bid: 158.200, ask: 158.250, spread: 50, low: 157.800, high: 158.500, changePoint: 150, changePercent: 0.40, digits: 3 },
    { symbol: 'GBPJPY', description: 'Great Britain Pound vs Japanese Yen', group: 'Forex', bid: 182.500, ask: 182.600, spread: 100, low: 181.900, high: 183.000, changePoint: -80, changePercent: -0.15, digits: 3 },
    { symbol: 'AUDJPY', description: 'Australian Dollar vs Japanese Yen', group: 'Forex', bid: 95.400, ask: 95.450, spread: 50, low: 95.000, high: 95.800, changePoint: 200, changePercent: 0.50, digits: 3 },
    { symbol: 'CADJPY', description: 'Canadian Dollar vs Japanese Yen', group: 'Forex', bid: 109.100, ask: 109.150, spread: 50, low: 108.800, high: 109.500, changePoint: 50, changePercent: 0.12, digits: 3 },
    { symbol: 'CHFJPY', description: 'Swiss Franc vs Japanese Yen', group: 'Forex', bid: 165.300, ask: 165.400, spread: 100, low: 165.000, high: 166.000, changePoint: -150, changePercent: -0.35, digits: 3 },

    // Exotics
    { symbol: 'USDCNH', description: 'US Dollar vs Chinese Yuan', group: 'Exotics', bid: 7.27298, ask: 7.27943, spread: 645, low: 7.25138, high: 7.29400, changePoint: -901, changePercent: -0.13, digits: 5 },
    { symbol: 'USDRUB', description: 'US Dollar vs Russian Ruble', group: 'Exotics', bid: 92.505, ask: 95.645, spread: 3140, low: 91.455, high: 96.797, changePoint: -1384, changePercent: -1.75, digits: 3 },
    { symbol: 'USDTRY', description: 'US Dollar vs Turkish Lira', group: 'Exotics', bid: 27.500, ask: 27.800, spread: 3000, low: 27.200, high: 28.100, changePoint: 5000, changePercent: 2.50, digits: 3 },
    { symbol: 'USDZAR', description: 'US Dollar vs South African Rand', group: 'Exotics', bid: 18.900, ask: 18.950, spread: 500, low: 18.700, high: 19.100, changePoint: 2000, changePercent: 0.85, digits: 3 },
    { symbol: 'USDMXN', description: 'US Dollar vs Mexican Peso', group: 'Exotics', bid: 17.500, ask: 17.550, spread: 500, low: 17.300, high: 17.700, changePoint: -400, changePercent: -0.25, digits: 3 },

    // Metals & Indices
    { symbol: 'XAUUSD', description: 'Gold vs US Dollar', group: 'Metals', bid: 1980.50, ask: 1981.10, spread: 60, low: 1970.00, high: 1990.00, changePoint: 1560, changePercent: 0.78, digits: 2 },
    { symbol: 'XAGUSD', description: 'Silver vs US Dollar', group: 'Metals', bid: 23.450, ask: 23.480, spread: 30, low: 23.100, high: 23.800, changePoint: -120, changePercent: -0.50, digits: 3 },
    { symbol: 'US500', description: 'S&P 500 Index', group: 'Indices', bid: 4350.50, ask: 4351.00, spread: 50, low: 4330.00, high: 4370.00, changePoint: 2500, changePercent: 0.55, digits: 2 },
    { symbol: 'US30', description: 'Wall Street 30 Index', group: 'Indices', bid: 33800.0, ask: 33805.0, spread: 500, low: 33600.0, high: 34000.0, changePoint: -15000, changePercent: -0.45, digits: 1 },
    { symbol: 'DE40', description: 'Germany 40 Index', group: 'Indices', bid: 15400.0, ask: 15405.0, spread: 500, low: 15300.0, high: 15500.0, changePoint: 8000, changePercent: 0.52, digits: 1 },

    // Crypto
    { symbol: 'BTCUSD', description: 'Bitcoin vs US Dollar', group: 'Crypto', bid: 34500.0, ask: 34510.0, spread: 1000, low: 34000.0, high: 35000.0, changePoint: 25000, changePercent: 0.75, digits: 1 },
    { symbol: 'ETHUSD', description: 'Ethereum vs US Dollar', group: 'Crypto', bid: 1850.50, ask: 1851.50, spread: 100, low: 1820.00, high: 1880.00, changePoint: -2500, changePercent: -1.35, digits: 2 },
    { symbol: 'LTCUSD', description: 'Litecoin vs US Dollar', group: 'Crypto', bid: 65.40, ask: 65.50, spread: 10, low: 64.00, high: 67.00, changePoint: 120, changePercent: 1.80, digits: 2 },
    { symbol: 'XRPUSD', description: 'Ripple vs US Dollar', group: 'Crypto', bid: 0.55040, ask: 0.55090, spread: 50, low: 0.54000, high: 0.56000, changePoint: -150, changePercent: -2.10, digits: 5 },

    // AUD Pairs (Requested in screenshot)
    { symbol: 'AUDCAD', description: 'Australian Dollar vs Canadian Dollar', group: 'Forex', bid: 0.8750, ask: 0.8753, spread: 30, low: 0.8720, high: 0.8780, changePoint: 0, changePercent: 0, digits: 5 },
    { symbol: 'AUDCHF', description: 'Australian Dollar vs Swiss Franc', group: 'Forex', bid: 0.5850, ask: 0.5855, spread: 50, low: 0.5820, high: 0.5880, changePoint: 0, changePercent: 0, digits: 5 },
    { symbol: 'AUDDKK', description: 'Australian Dollar vs Danish Krone', group: 'Forex', bid: 4.5000, ask: 4.5050, spread: 500, low: 4.4800, high: 4.5200, changePoint: 0, changePercent: 0, digits: 4 },
    { symbol: 'AUDHKD', description: 'Australian Dollar vs Hong Kong Dollar', group: 'Forex', bid: 5.1000, ask: 5.1050, spread: 50, low: 5.0800, high: 5.1200, changePoint: 0, changePercent: 0, digits: 4 },
    { symbol: 'AUDHUF', description: 'Australian Dollar vs Hungarian Forint', group: 'Exotics', bid: 230.00, ask: 231.00, spread: 1000, low: 228.00, high: 232.00, changePoint: 0, changePercent: 0, digits: 2 },
    { symbol: 'AUDNOK', description: 'Australian Dollar vs Norwegian Krone', group: 'Forex', bid: 7.1000, ask: 7.1050, spread: 50, low: 7.0800, high: 7.1200, changePoint: 0, changePercent: 0, digits: 4 },
    { symbol: 'AUDNZD', description: 'Australian Dollar vs New Zealand Dollar', group: 'Forex', bid: 1.0800, ask: 1.0805, spread: 50, low: 1.0780, high: 1.0820, changePoint: 0, changePercent: 0, digits: 5 },
    { symbol: 'AUDPLN', description: 'Australian Dollar vs Polish Zloty', group: 'Exotics', bid: 2.7500, ask: 2.7550, spread: 500, low: 2.7300, high: 2.7700, changePoint: 0, changePercent: 0, digits: 4 },
    { symbol: 'AUDSEK', description: 'Australian Dollar vs Swedish Krona', group: 'Forex', bid: 7.1500, ask: 7.1550, spread: 50, low: 7.1200, high: 7.1800, changePoint: 0, changePercent: 0, digits: 4 },
    { symbol: 'AUDSGD', description: 'Australian Dollar vs Singapore Dollar', group: 'Forex', bid: 0.8900, ask: 0.8905, spread: 50, low: 0.8880, high: 0.8920, changePoint: 0, changePercent: 0, digits: 5 },
];
