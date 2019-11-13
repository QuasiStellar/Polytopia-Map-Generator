
let page = 'main';

let map_size = 16;

let tribes_list = ['Xin-Xi', 'Imperius', 'Bardur', 'Oumaji', 'Kickoo', 'Hoodrick', 'Luxidoor', 'Vengir', 'Zebasi',
    'Ai-Mo', 'Quetzali', 'Yadakk', 'Aquarion', 'Elyrion', 'Polaris'];
let terrain = [/*'forest', 'fruit', 'game', */'ground'/*, 'mountain'*/];
let general_terrain = ['crop', 'fish', 'metal', 'ocean', 'ruin', 'village', 'water', 'whale'];

let assets = [];
for (let tribe of tribes_list) {
    assets[tribe] = [];
}
for (let g_t of general_terrain) {
    assets[g_t] = get_image("assets/" + g_t + ".png");
}
for (let tribe of tribes_list) {
    for (let terr of terrain) {
        assets[tribe][terr] = get_image("assets/" + tribe + "_" + terr + ".png");
    }
    assets[tribe]['capital'] = get_image("assets/" + tribe + "_head.png");
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
    let map = new Array(map_size);

    for (let i = 0; i < map_size; i++) {
        map[i] = new Array(map_size);
        for (let j = 0; j < map_size; j++)
            map[i][j] = {type: 'ocean', above: null, road: false, tribe: 'Xin-Xi'}
    }

    let i = 0;
    while (i < map_size**2 * initial_land) {
        let row = random_int(0, map_size - 1);
        let column = random_int(0, map_size - 1);
        if (map[row][column]['type'] === 'ocean') {
            i++;
            map[row][column]['type'] = 'ground';
        }
    }

    for (let i = 0; i < smoothing; i++) {
        for (let row = 0; row < map_size; row++) {
            for (let column = 0; column < map_size; column++) {
                let water_count = 0;
                let tile_count = 0;
                if (column > 0) {
                    if (row > 0) {
                        if (map[row - 1][column - 1]['type'] === 'ocean')
                            water_count++;
                        tile_count++;
                    }
                    if (row < map_size - 1) {
                        if (map[row + 1][column - 1]['type'] === 'ocean')
                            water_count++;
                        tile_count++;
                    }
                    if (map[row][column - 1]['type'] === 'ocean')
                        water_count++;
                    tile_count++;
                }
                if (column < map_size - 1) {
                    if (row > 0) {
                        if (map[row - 1][column + 1]['type'] === 'ocean')
                            water_count++;
                        tile_count++;
                    }
                    if (row < map_size - 1) {
                        if (map[row + 1][column + 1]['type'] === 'ocean')
                            water_count++;
                        tile_count++;
                    }
                    if (map[row][column + 1]['type'] === 'ocean')
                        water_count++;
                    tile_count++;
                }
                if (row > 0) {
                    if (map[row - 1][column]['type'] === 'ocean')
                        water_count++;
                    tile_count++;
                }
                if (row < map_size - 1) {
                    if (map[row + 1][column]['type'] === 'ocean')
                        water_count++;
                    tile_count++;
                }
                if (map[row][column]['type'] === 'ocean')
                    water_count++;
                tile_count++;

                if (water_count / tile_count < land_coefficient)
                    map[row][column]['road'] = true;
            }
        }
        for (let row = 0; row < map_size; row++) {
            for (let column = 0; column < map_size; column++) {
                if (map[row][column]['road'] === true) {
                    map[row][column]['road'] = false;
                    map[row][column]['type'] = 'ground';
                } else {
                    map[row][column]['type'] = 'ocean';
                }
            }
        }
    }

    for (let row = 0; row < map_size; row++) {
        for (let column = 0; column < map_size; column++) {
            if (map[row][column]['type'] === 'ocean') {
                if (column > 0) {
                    if (map[row][column - 1]['type'] === 'ground') {
                        map[row][column]['type'] = 'water';
                        continue;
                    }
                }
                if (column < map_size - 1) {
                    if (map[row][column + 1]['type'] === 'ground') {
                        map[row][column]['type'] = 'water';
                        continue;
                    }
                }
                if (row > 0) {
                    if (map[row - 1][column]['type'] === 'ground') {
                        map[row][column]['type'] = 'water';
                        continue;
                    }
                }
                if (row < map_size - 1) {
                    if (map[row + 1][column]['type'] === 'ground') {
                        map[row][column]['type'] = 'water';
                    }
                }
            }
        }
    }

    let capital_cells = [];
    let capital_map = {};
    for (let tribe of tribes) {
        for (let row = 2; row < map_size - 2; row++) {
            for (let column = 2; column < map_size - 2; column++) {
                if (map[row][column]['type'] === 'ground') {
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
        let rand_cell = random_int(0, len - 1);
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
        map[capital_cells[i] / map_size | 0][capital_cells[i] % map_size]['above'] = 'capital';
        map[capital_cells[i] / map_size | 0][capital_cells[i] % map_size]['tribe'] = tribes[i];
    }

    display_map(map);

    let text_output_check = document.getElementById("text_output_check").checked;
    if (text_output_check)
        print_map(map);
    else
        document.getElementById("text_display").style.display='none';
}

function initial_gen() {
    setTimeout(function () {
        generate();
    }, 1000);
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
        seen_grid[map_size - 1 + column - row + (column + row) * map_size * 2] = map[row][column]['type'][0];
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
    graphic_display.width = graphic_display.width;
    let canvas = graphic_display.getContext("2d");

    let tile_size = 1000 / map_size;

    for (let i = 0; i < map_size**2; i++) {
        let row = Math.floor(i / map_size);
        let column = i % map_size;
        let x = 500 - tile_size / 2 + (column - row) * tile_size / 2;
        let y = (column + row) * tile_size / 1908 * 606;
        let type = map[row][column]['type'];
        let above = map[row][column]['above'];
        let tribe = map[row][column]['tribe'];
        if (general_terrain.includes(type)) {
            canvas.drawImage(assets[type], x, y, tile_size, tile_size);
        } else if (tribe) {
            canvas.drawImage(assets[tribe][type], x, y, tile_size, tile_size);
        }
        if (above === 'capital') {
            canvas.drawImage(assets[tribe][above], x, y - 0.75 * tile_size, tile_size, tile_size);
        }
    }
}

function random_int(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}

function toggle_tribe(tribe_check, tribe) {
    if (document.getElementById(tribe_check).checked)
        document.getElementById(tribe).style.display='block';
    else
        document.getElementById(tribe).style.display='none';
}