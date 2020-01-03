
let page = 'main';

let map_size;

const tribes_list = ['Xin-xi', 'Imperius', 'Bardur', 'Oumaji', 'Kickoo', 'Hoodrick', 'Luxidoor', 'Vengir', 'Zebasi',
    'Ai-mo', 'Quetzali', 'Yadakk', 'Aquarion', 'Elyrion', 'Polaris'];
const terrain = ['forest', 'fruit', 'game', 'ground', 'mountain'];
const general_terrain = ['crop', 'fish', 'metal', 'ocean', 'ruin', 'village', 'water', 'whale'];
const _____ = 2;
const ____ = 1.5;
const ___ = 1;
const __ = 0.5;
const _ = 0.1;
const BORDER_EXPANSION = 1/3;
const terrain_probs = {'water': {'Xin-xi': 0, 'Imperius': 0, 'Bardur': 0, 'Oumaji': 0, 'Kickoo': 0.4, 'Hoodrick': 0, 'Luxidoor': 0,
                        'Vengir': 0, 'Zebasi': 0, 'Ai-mo': 0, 'Quetzali': 0, 'Yadakk': 0, 'Aquarion': 0.3, 'Elyrion': 0, 'Polaris': 0},
                    'forest': {'Xin-xi': ___, 'Imperius': ___, 'Bardur': ___, 'Oumaji': _, 'Kickoo': ___, 'Hoodrick': ____, 'Luxidoor': ___,
                        'Vengir': ___, 'Zebasi': __, 'Ai-mo': ___, 'Quetzali': ___, 'Yadakk': __, 'Aquarion': __, 'Elyrion': ___, 'Polaris': 0},
                    'mountain': {'Xin-xi': ____, 'Imperius': ___, 'Bardur': ___, 'Oumaji': ___, 'Kickoo': __, 'Hoodrick': __, 'Luxidoor': ___,
                        'Vengir': ___, 'Zebasi': __, 'Ai-mo': ____, 'Quetzali': ___, 'Yadakk': __, 'Aquarion': ___, 'Elyrion': __, 'Polaris': 0},
                    'metal': {'Xin-xi': ___, 'Imperius': ___, 'Bardur': ___, 'Oumaji': ___, 'Kickoo': ___, 'Hoodrick': ___, 'Luxidoor': ___,
                        'Vengir': ___, 'Zebasi': ___, 'Ai-mo': ___, 'Quetzali': _, 'Yadakk': ___, 'Aquarion': ___, 'Elyrion': ___, 'Polaris': 0},
                    'fruit': {'Xin-xi': ___, 'Imperius': ___, 'Bardur': ___, 'Oumaji': ___, 'Kickoo': ___, 'Hoodrick': ___, 'Luxidoor': _____,
                        'Vengir': _, 'Zebasi': __, 'Ai-mo': ___, 'Quetzali': _____, 'Yadakk': ____, 'Aquarion': ___, 'Elyrion': ___, 'Polaris': 0},
                    'crop': {'Xin-xi': ___, 'Imperius': ___, 'Bardur': _, 'Oumaji': ___, 'Kickoo': ___, 'Hoodrick': ___, 'Luxidoor': ___,
                        'Vengir': ___, 'Zebasi': ___, 'Ai-mo': _, 'Quetzali': _, 'Yadakk': ___, 'Aquarion': ___, 'Elyrion': ____, 'Polaris': 0},
                    'game': {'Xin-xi': ___, 'Imperius': ___, 'Bardur': _____, 'Oumaji': ___, 'Kickoo': ___, 'Hoodrick': ___, 'Luxidoor': __,
                        'Vengir': __, 'Zebasi': ___, 'Ai-mo': ___, 'Quetzali': ___, 'Yadakk': ___, 'Aquarion': ___, 'Elyrion': ___, 'Polaris': 0},
                    'fish': {'Xin-xi': ___, 'Imperius': ___, 'Bardur': ___, 'Oumaji': ___, 'Kickoo': ____, 'Hoodrick': ___, 'Luxidoor': ___,
                        'Vengir': __, 'Zebasi': ___, 'Ai-mo': ___, 'Quetzali': ___, 'Yadakk': ___, 'Aquarion': ___, 'Elyrion': ___, 'Polaris': 0},
                    'whale': {'Xin-xi': ___, 'Imperius': ___, 'Bardur': ___, 'Oumaji': ___, 'Kickoo': ___, 'Hoodrick': ___, 'Luxidoor': ___,
                        'Vengir': ___, 'Zebasi': ___, 'Ai-mo': ___, 'Quetzali': ___, 'Yadakk': ___, 'Aquarion': ___, 'Elyrion': ___, 'Polaris': 0}};
const general_probs = {'mountain': 0.15, 'forest': 0.4, 'fruit': 0.5, 'crop': 0.5, 'fish': 0.5, 'game': 0.5, 'whale': 0.4, 'metal': 0.5};

let assets = [];
for (let tribe of tribes_list) {
    assets[tribe] = [];
}
for (let g_t of general_terrain) {
    assets[g_t] = get_image("assets/" + g_t + ".png");
}
for (let tribe of tribes_list) {
    for (let terr of terrain) {
        assets[tribe][terr] = get_image("assets/" + tribe + "/" + tribe + " " + terr + ".png");
    }
    assets[tribe]['capital'] = get_image("assets/" + tribe + "/" + tribe + " head.png");
}

function switch_page(new_page) {
    document.getElementById("main").style.display='none';
    document.getElementById("faq").style.display='none';
    page = new_page;
    document.getElementById(new_page).style.display='block';
}

function get_image(src) {
    let image = new Image();
    image.src = src;
    return image;
}

function generate() {
    map_size = parseInt(document.getElementById("map_size").value);
    if (map_size < 5 || map_size !== Math.floor(map_size)) {
        document.getElementById("warning").innerText = 'Warning: Map size must be integer at least 5.';
        document.getElementById("warning").style.display='block';
        return;
    }

    let initial_land = parseFloat(document.getElementById("initial_land").value);
    if (initial_land < 0 || initial_land > 1) {
        document.getElementById("warning").innerText = 'Warning: Initial land must be float between 0 and 1.';
        document.getElementById("warning").style.display='block';
        return;
    }

    let smoothing = parseInt(document.getElementById("smoothing").value);
    if (smoothing < 0 || smoothing !== Math.floor(smoothing)) {
        document.getElementById("warning").innerText = 'Warning: Smoothing must be integer at least 0.';
        document.getElementById("warning").style.display='block';
        return;
    }

    let relief = parseInt(document.getElementById("relief").value);
    if (relief < 1 || relief > 8 || relief !== Math.floor(relief)) {
        document.getElementById("warning").innerText = 'Warning: Relief must be integer between 1 and 8.';
        document.getElementById("warning").style.display='block';
        return;
    }

    let tribes = document.getElementById("tribes").value;
    tribes = tribes.split(" ");
    for (let tribe of tribes) {
        if (!tribes_list.includes(tribe)) {
            document.getElementById("warning").innerText = 'Warning: list tribes in pick-order separating with spaces.';
            document.getElementById("warning").style.display='block';
            return;
        }
    }

    document.getElementById("warning").style.display='none';

    let land_coefficient = (0.5 + relief) / 9;
    let map = new Array(map_size**2);

    for (let i = 0; i < map_size**2; i++) {
        map[i] = {type: 'ocean', above: null, road: false, tribe: 'Xin-xi'};
    }

    let i = 0;
    while (i < map_size**2 * initial_land) {
        let cell = random_int(0, map_size**2);
        if (map[cell]['type'] === 'ocean') {
            i++;
            map[cell]['type'] = 'ground';
        }
    }

    for (let i = 0; i < smoothing; i++) {
        for (let row = 0; row < map_size; row++) {
            for (let column = 0; column < map_size; column++) {
                let water_count = 0;
                let tile_count = 0;
                if (column > 0) {
                    if (row > 0) {
                        if (map[(row - 1) * map_size + (column - 1)]['type'] === 'ocean')
                            water_count++;
                        tile_count++;
                    }
                    if (row < map_size - 1) {
                        if (map[(row + 1) * map_size + (column - 1)]['type'] === 'ocean')
                            water_count++;
                        tile_count++;
                    }
                    if (map[row * map_size + (column - 1)]['type'] === 'ocean')
                        water_count++;
                    tile_count++;
                }
                if (column < map_size - 1) {
                    if (row > 0) {
                        if (map[(row - 1) * map_size + (column + 1)]['type'] === 'ocean')
                            water_count++;
                        tile_count++;
                    }
                    if (row < map_size - 1) {
                        if (map[(row + 1) * map_size + (column + 1)]['type'] === 'ocean')
                            water_count++;
                        tile_count++;
                    }
                    if (map[row * map_size + (column + 1)]['type'] === 'ocean')
                        water_count++;
                    tile_count++;
                }
                if (row > 0) {
                    if (map[(row - 1) * map_size + column]['type'] === 'ocean')
                        water_count++;
                    tile_count++;
                }
                if (row < map_size - 1) {
                    if (map[(row + 1) * map_size + column]['type'] === 'ocean')
                        water_count++;
                    tile_count++;
                }
                if (map[row * map_size + column]['type'] === 'ocean')
                    water_count++;
                tile_count++;

                if (water_count / tile_count < land_coefficient)
                    map[row * map_size + column]['road'] = true;
            }
        }
        for (let row = 0; row < map_size; row++) {
            for (let column = 0; column < map_size; column++) {
                if (map[row * map_size + column]['road'] === true) {
                    map[row * map_size + column]['road'] = false;
                    map[row * map_size + column]['type'] = 'ground';
                } else {
                    map[row * map_size + column]['type'] = 'ocean';
                }
            }
        }
    }

    let capital_cells = [];
    let capital_map = {};
    for (let tribe of tribes) {
        for (let row = 2; row < map_size - 2; row++) {
            for (let column = 2; column < map_size - 2; column++) {
                if (map[row * map_size + column]['type'] === 'ground') {
                    capital_map[row * map_size + column] = 0;
                }
            }
        }
    }
    for (let tribe of tribes) {
        let max = 0;
        for (let cell in capital_map) {
            capital_map[cell] = map_size;
            for (let capital_cell of capital_cells) {
                capital_map[cell] = Math.min(capital_map[cell], distance(cell, capital_cell, map_size));
            }
            max = Math.max(max, capital_map[cell]);
        }
        let len = 0;
        for (let cell in capital_map) {
            if (capital_map[cell] === max) {
                len++;
            }
        }
        let rand_cell = random_int(0, len);
        for (let cell of Object.entries(capital_map)) {
            if (cell[1] === max) {
                if (rand_cell === 0) {
                    capital_cells.push(cell[0]);
                }
                rand_cell--;
            }
        }
    }
    for (let i = 0; i < capital_cells.length; i++) {
        map[(capital_cells[i] / map_size | 0) * map_size + (capital_cells[i] % map_size)]['above'] = 'capital';
        map[(capital_cells[i] / map_size | 0) * map_size + (capital_cells[i] % map_size)]['tribe'] = tribes[i];
    }

    let done_tiles = [];
    let active_tiles = [];
    for (let i = 0; i < capital_cells.length; i++) {
        let row = capital_cells[i] / map_size | 0;
        let column = capital_cells[i] % map_size;
        done_tiles[i] = [row, column];
        active_tiles[i] = [[row, column]];
    }
    while (done_tiles.length !== map_size**2) {
        for (let i = 0; i < tribes.length; i++) {
            if (active_tiles[i].length && tribes[i] !== 'Polaris') {
                let rand_number = random_int(0, active_tiles[i].length);
                let rand_cell = active_tiles[i][rand_number];
                let neighbours = [[rand_cell[0]-1, rand_cell[1]],
                                [rand_cell[0]+1, rand_cell[1]],
                                [rand_cell[0], rand_cell[1]+1],
                                [rand_cell[0], rand_cell[1]-1],
                                [rand_cell[0]-1, rand_cell[1]-1],
                                [rand_cell[0]+1, rand_cell[1]+1],
                                [rand_cell[0]-1, rand_cell[1]+1],
                                [rand_cell[0]+1, rand_cell[1]-1]];
                let valid_neighbours = neighbours.filter(value => !arr_in_arr(value, done_tiles) &&
                                0 <= value[0] && value[0] < map_size && 0 <= value[1] && value[1] < map_size &&
                                map[value[0] * map_size + value[1]]['type'] !== 'water');
                if (!valid_neighbours.length) {
                    valid_neighbours = neighbours.filter(value => !arr_in_arr(value, done_tiles) &&
                        0 <= value[0] && value[0] < map_size && 0 <= value[1] && value[1] < map_size);
                }
                if (valid_neighbours.length) {
                    let new_rand_number = random_int(0, valid_neighbours.length);
                    let new_rand_cell = valid_neighbours[new_rand_number];
                    map[new_rand_cell[0] * map_size + new_rand_cell[1]]['tribe'] = tribes[i];
                    active_tiles[i].push(new_rand_cell);
                    done_tiles.push(new_rand_cell);
                } else {
                    active_tiles[i].splice(rand_number, 1);
                }
            }
        }
    }

    for (let cell = 0; cell < map_size**2; cell++) {
        if (map[cell]['type'] === 'ground' && map[cell]['above'] === null) {
            let rand = Math.random();
            if (rand < general_probs['forest'] * terrain_probs['forest'][map[cell]['tribe']]) {
                map[cell]['type'] = 'forest';
            } else if (rand > 1 - general_probs['mountain'] * terrain_probs['mountain'][map[cell]['tribe']]) {
                map[cell]['type'] = 'mountain';
            }
            rand = Math.random();
            if (rand < terrain_probs['water'][map[cell]['tribe']]) {
                map[cell]['type'] = 'ocean';
            }
        }
    }

    // -1 - water far away
    // 0 - far away
    // 1 - border expansion
    // 2 - initial territory
    // 3 - village
    let village_map = [];
    for (let cell = 0; cell < map_size**2; cell++) {
        let row = cell / map_size | 0;
        let column = cell % map_size;
        if (map[cell]['type'] === 'ocean' || map[cell]['type'] === 'mountain') {
            village_map[cell] = -1;
        } else if (row === 0 || row === map_size - 1 || column === 0 || column === map_size - 1) {
            village_map[cell] = -1; // villages don't spawn next to the map border
        } else {
            village_map[cell] = 0;
        }
    }
    // we'll place villages until there are none of 'far away' tiles

    let land_like_terrain = ['ground', 'forest', 'mountain'];
    for (let row = 0; row < map_size; row++) {
        for (let column = 0; column < map_size; column++) {
            if (map[row * map_size + column]['type'] === 'ocean') {
                if (column > 0) {
                    if (land_like_terrain.indexOf(map[row * map_size + (column - 1)]['type']) !== -1) {
                        map[row * map_size + column]['type'] = 'water';
                        continue;
                    }
                }
                if (column < map_size - 1) {
                    if (land_like_terrain.indexOf(map[row * map_size + (column + 1)]['type']) !== -1) {
                        map[row * map_size + column]['type'] = 'water';
                        continue;
                    }
                }
                if (row > 0) {
                    if (land_like_terrain.indexOf(map[(row - 1) * map_size + column]['type']) !== -1) {
                        map[row * map_size + column]['type'] = 'water';
                        continue;
                    }
                }
                if (row < map_size - 1) {
                    if (land_like_terrain.indexOf(map[(row + 1) * map_size + column]['type']) !== -1) {
                        map[row * map_size + column]['type'] = 'water';
                    }
                }
            }
        }
    }

    for (let capital of capital_cells) {
        village_map[capital] = 3;
        for (let cell of circle(capital, 1)) {
            village_map[cell] = Math.max(village_map[cell], 2);
        }
        for (let cell of circle(capital, 2)) {
            village_map[cell] = Math.max(village_map[cell], 1);
        }
    }

    while (village_map.indexOf(0) !== -1) {
        let new_village = rand_array_element(village_map.map((cell, index) => cell === 0 ? index : null).filter(cell => cell !== null));
        village_map[new_village] = 3;
        for (let cell of circle(new_village, 1)) {
            village_map[cell] = Math.max(village_map[cell], 2);
        }
        for (let cell of circle(new_village, 2)) {
            village_map[cell] = Math.max(village_map[cell], 1);
        }
    }

    function proc(cell, probability) {
        return (village_map[cell] === 2 && Math.random() < probability) || (village_map[cell] === 1 && Math.random() < probability * BORDER_EXPANSION)
    }

    for (let cell = 0; cell < map_size**2; cell++) {
        switch (map[cell]['type']) {
            case 'ground':
                if (map[cell]['above'] !== 'capital') {
                    if (village_map[cell] === 3) {
                        map[cell]['above'] = 'village';
                    } else if (proc(cell, general_probs['fruit'] * terrain_probs['fruit'][map[cell]['tribe']])) {
                        map[cell]['above'] = 'fruit';
                    } else if (proc(cell, general_probs['crop'] * terrain_probs['crop'][map[cell]['tribe']] / (1 - general_probs['fruit'] * terrain_probs['fruit'][map[cell]['tribe']]))) {
                        map[cell]['above'] = 'crop';
                    }
                }
                break;
            case 'forest':
                if (map[cell]['above'] !== 'capital') {
                    if (village_map[cell] === 3) {
                        map[cell]['type'] = 'ground';
                        map[cell]['above'] = 'village';
                    } else if (proc(cell, general_probs['game'] * terrain_probs['game'][map[cell]['tribe']])) {
                        map[cell]['above'] = 'game';
                    }
                }
                break;
            case 'water':
                if (proc(cell, general_probs['fish'] * terrain_probs['fish'][map[cell]['tribe']])) {
                    map[cell]['above'] = 'fish';
                }
                break;
            case 'ocean':
                if (proc(cell, general_probs['whale'] * terrain_probs['whale'][map[cell]['tribe']])) {
                    map[cell]['above'] = 'whale';
                }
                break;
            case 'mountain':
                if (proc(cell, general_probs['metal'] * terrain_probs['metal'][map[cell]['tribe']])) {
                    map[cell]['above'] = 'metal';
                    console.log(1)
                }
                break;
        }
    }

    display_map(map);

    let text_output_check = document.getElementById("text_output_check").checked;
    if (text_output_check)
        print_map(map);
    else
        document.getElementById("text_display").style.display='none';
}

function distance(a, b, size) {
    let ax = a % size;
    let ay = a / size | 0;
    let bx = b % size;
    let by = b / size | 0;
    return Math.max(Math.abs(ax - bx), Math.abs(ay - by));
}

function print_map(map) {
    let seen_grid = Array(map_size**2 * 4);
    for (let i = 0; i < map_size**2 * 4; i++) {
        seen_grid[i] = '-';
    }
    for (let i = 0; i < map_size**2; i++) {
        let row = Math.floor(i / map_size);
        let column = i % map_size;
        seen_grid[map_size - 1 + column - row + (column + row) * map_size * 2] = map[row * map_size + column]['type'][0];
    }
    let output = '';
    for (let i = 0; i < map_size * 2; i++) {
        output += seen_grid.slice(i * map_size * 2, (i + 1) * map_size * 2).join('');
        output += '\n'
    }

    document.getElementById("text_display").innerText = output;
    document.getElementById("text_display").style.display='block';
}

function display_map(map) {
    let graphic_display = document.getElementById("graphic_display");
    graphic_display.width = graphic_display.width + 0;
    let canvas = graphic_display.getContext("2d");

    let tile_size = 1000 / map_size;

    function draw(image, x, y, tile_size) {
        let new_height = image.height * tile_size / image.width;
        canvas.drawImage(image, x, y, tile_size, new_height);
    }

    let tile_height = assets['Xin-xi']['ground'].height;
    let tile_width = assets['Xin-xi']['ground'].width;
    for (let i = 0; i < map_size**2; i++) {
        let row = i / map_size | 0;
        let column = i % map_size;
        let x = 500 - tile_size / 2 + (column - row) * tile_size / 2;
        let y = (column + row) * tile_height * tile_size / tile_width / 1908 * 606;
        let type = map[row * map_size + column]['type'];
        let above = map[row * map_size + column]['above'];
        let tribe = map[row * map_size + column]['tribe'];
        if (general_terrain.includes(type)) {
            canvas.drawImage(assets[type], x, y, tile_size, tile_size);
        } else if (tribe) {
            if (type === 'forest' || type === 'mountain') {
                let height = assets[tribe]['ground'].height;
                let width = assets[tribe]['ground'].width;
                canvas.drawImage(assets[tribe]['ground'], x, y, tile_size, height * tile_size / width);
                height = assets[tribe][type].height;
                width = assets[tribe][type].width;
                let lowering = tribe === 'Kickoo' && type === 'mountain' ? 0.92 : 0.62;
                canvas.drawImage(assets[tribe][type], x, y + lowering * tile_size - tile_size * height / width, tile_size, height * tile_size / width);
            } else if (type === 'water' || type === 'ocean') {
                let height = assets[tribe][type].height;
                let width = assets[tribe][type].width;
                canvas.drawImage(assets[tribe][type], x, y - 0.3 * tile_size, tile_size, height * tile_size / width);
            } else {
                let height = assets[tribe][type].height;
                let width = assets[tribe][type].width;
                canvas.drawImage(assets[tribe][type], x, y, tile_size, height * tile_size / width);
            }
        }
        if (above === 'whale') {
            let height = assets[above].height;
            let width = assets[above].width;
            canvas.drawImage(assets['whale'], x, y, tile_size, height * tile_size / width);
        } else if (above === 'village') {
            let height = assets[above].height;
            let width = assets[above].width;
            canvas.drawImage(assets['village'], x, y, tile_size, height * tile_size / width);
        } else if (above === 'game') {
            let height = assets[tribe][above].height;
            let width = assets[tribe][above].width;
            canvas.drawImage(assets[tribe][above], x, y, tile_size, height * tile_size / width);
        } else if (above === 'fruit') {
            let height = assets[tribe][above].height;
            let width = assets[tribe][above].width;
            canvas.drawImage(assets[tribe][above], x, y, tile_size, height * tile_size / width);
        } else if (above === 'crop') {
            let height = assets[above].height;
            let width = assets[above].width;
            canvas.drawImage(assets['crop'], x, y, tile_size, height * tile_size / width);
        } else if (above === 'fish') {
            let height = assets[above].height;
            let width = assets[above].width;
            canvas.drawImage(assets['fish'], x, y, tile_size, height * tile_size / width);
        } else if (above === 'metal') {
            let height = assets[above].height;
            let width = assets[above].width;
            canvas.drawImage(assets['metal'], x, y, tile_size, height * tile_size / width);
        }
    }
}

function random_int(min, max) {
    let rand = min + Math.random() * (max - min);
    return Math.floor(rand);
}

function rand_array_element(arr) {
    return arr[Math.random() * arr.length | 0];
}

function arr_in_arr(piece_a, array) {
    for (let piece_b of array) {
        if (piece_b.length === piece_a.length) {
            let equal = true;
            for (let i = 0; i < piece_a.length; i++) {
                if (piece_b[i] !== piece_a[i]) {
                    equal = false;
                    break;
                }
            }
            if (equal)
                return true;
        }
    }
    return false;
}

function circle(center, radius) {
    let circle = [];
    let row = center / map_size | 0;
    let column = center % map_size;
    let i = row - radius;
    if (i >= 0 && i < map_size) {
        for (let j = column - radius; j < column + radius; j++) {
            if (j >= 0 && j < map_size) {
                circle.push(i * map_size + j)
            }
        }
    }
    i = row + radius;
    if (i >= 0 && i < map_size) {
        for (let j = column + radius; j > column - radius; j--) {
            if (j >= 0 && j < map_size) {
                circle.push(i * map_size + j)
            }
        }
    }
    let j = column - radius;
    if (j >= 0 && j < map_size) {
        for (let i = row + radius; i > row - radius; i--) {
            if (i >= 0 && i < map_size) {
                circle.push(i * map_size + j)
            }
        }
    }
    j = column + radius;
    if (j >= 0 && j < map_size) {
        for (let i = row - radius; i < row + radius; i++) {
            if (i >= 0 && i < map_size) {
                circle.push(i * map_size + j)
            }
        }
    }
    return circle;
}
