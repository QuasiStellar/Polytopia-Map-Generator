
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
                        'Vengir': 0, 'Zebasi': 0, 'Ai-mo': 0, 'Quetzali': 0, 'Yadakk': 0, 'Aquarion': 0.3, 'Elyrion': 0},
                    'forest': {'Xin-xi': ___, 'Imperius': ___, 'Bardur': ___, 'Oumaji': _, 'Kickoo': ___, 'Hoodrick': ____, 'Luxidoor': ___,
                        'Vengir': ___, 'Zebasi': __, 'Ai-mo': ___, 'Quetzali': ___, 'Yadakk': __, 'Aquarion': __, 'Elyrion': ___},
                    'mountain': {'Xin-xi': ____, 'Imperius': ___, 'Bardur': ___, 'Oumaji': ___, 'Kickoo': __, 'Hoodrick': __, 'Luxidoor': ___,
                        'Vengir': ___, 'Zebasi': __, 'Ai-mo': ____, 'Quetzali': ___, 'Yadakk': __, 'Aquarion': ___, 'Elyrion': __},
                    'metal': {'Xin-xi': ___, 'Imperius': ___, 'Bardur': ___, 'Oumaji': ___, 'Kickoo': ___, 'Hoodrick': ___, 'Luxidoor': ___,
                        'Vengir': ___, 'Zebasi': ___, 'Ai-mo': ___, 'Quetzali': _, 'Yadakk': ___, 'Aquarion': ___, 'Elyrion': ___},
                    'fruit': {'Xin-xi': ___, 'Imperius': ___, 'Bardur': ___, 'Oumaji': ___, 'Kickoo': ___, 'Hoodrick': ___, 'Luxidoor': _____,
                        'Vengir': _, 'Zebasi': __, 'Ai-mo': ___, 'Quetzali': _____, 'Yadakk': ____, 'Aquarion': ___, 'Elyrion': ___},
                    'crop': {'Xin-xi': ___, 'Imperius': ___, 'Bardur': _, 'Oumaji': ___, 'Kickoo': ___, 'Hoodrick': ___, 'Luxidoor': ___,
                        'Vengir': ___, 'Zebasi': ___, 'Ai-mo': _, 'Quetzali': _, 'Yadakk': ___, 'Aquarion': ___, 'Elyrion': ____},
                    'game': {'Xin-xi': ___, 'Imperius': ___, 'Bardur': _____, 'Oumaji': ___, 'Kickoo': ___, 'Hoodrick': ___, 'Luxidoor': __,
                        'Vengir': __, 'Zebasi': ___, 'Ai-mo': ___, 'Quetzali': ___, 'Yadakk': ___, 'Aquarion': ___, 'Elyrion': ___},
                    'fish': {'Xin-xi': ___, 'Imperius': ___, 'Bardur': ___, 'Oumaji': ___, 'Kickoo': ____, 'Hoodrick': ___, 'Luxidoor': ___,
                        'Vengir': __, 'Zebasi': ___, 'Ai-mo': ___, 'Quetzali': ___, 'Yadakk': ___, 'Aquarion': ___, 'Elyrion': ___},
                    'whale': {'Xin-xi': ___, 'Imperius': ___, 'Bardur': ___, 'Oumaji': ___, 'Kickoo': ___, 'Hoodrick': ___, 'Luxidoor': ___,
                        'Vengir': ___, 'Zebasi': ___, 'Ai-mo': ___, 'Quetzali': ___, 'Yadakk': ___, 'Aquarion': ___, 'Elyrion': ___}};
const general_probs = {'mountain': 0.15, 'forest': 0.4, 'fruit': 0.5, 'crop': 0.5, 'fish': 0.5, 'game': 0.5, 'whale': 0.4, 'metal': 0.5};

let assets = [];
let get_assets = new Promise(resolve => {
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
    resolve();
});

function onload() {
    get_assets.then(() => {
        generate();
    })
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

    let fill = document.getElementById("fill").value;
    if (fill !== '') {
        if (!tribes_list.includes(fill)) {
            document.getElementById("warning").innerText = 'Warning: there is no such a tribe.';
            document.getElementById("warning").style.display='block';
            return;
        }
    }

    document.getElementById("warning").style.display='none';

    // let the show begin
    console.time('Initial map');
    let land_coefficient = (0.5 + relief) / 9;
    let map = new Array(map_size**2);

    // add initial ocean tiles
    for (let i = 0; i < map_size**2; i++) {
        map[i] = {type: 'ocean', above: null, road: false, tribe: fill ? fill : 'Xin-xi'}; // tribes don't matter so far
    }

    // randomly replace half of the tiles with ground
    let i = 0;
    while (i < map_size**2 * initial_land) {
        let cell = random_int(0, map_size**2);
        if (map[cell]['type'] === 'ocean') {
            i++;
            map[cell]['type'] = 'ground';
        }
    }
    console.timeEnd('Initial map');

    // turning random water/ground grid into something smooth
    console.time('Smoothing');
    for (let i = 0; i < smoothing; i++) {
        for (let cell = 0; cell < map_size**2; cell++) {
            let water_count = 0;
            let tile_count = 0;
            let neighbours = round(cell, 1);
            for (let i = 0; i < neighbours.length; i++) {
                if (map[neighbours[i]]['type'] === 'ocean') {
                    water_count++;
                }
                tile_count++;
            }
            if (water_count / tile_count <= land_coefficient)
                map[cell]['road'] = true; // mark as a road if it has to be ground (most of the neighbours are ground)
        }
        // turn marked tiles into ground & everything else into water
        for (let cell = 0; cell < map_size**2; cell++) {
            if (map[cell]['road'] === true) {
                map[cell]['road'] = false;
                map[cell]['type'] = 'ground';
            } else {
                map[cell]['type'] = 'ocean';
            }
        }
    }
    console.timeEnd('Smoothing');

    // capital distribution
    let capital_cells = [];
    if (!fill) {
        console.time('Capital distribution');
        let capital_map = {};
        // make a map of potential (ground) tiles associated with numbers (0 by default)
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
            // this number is a sum of distances between the tile and all capitals
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
            // we want to find a tile with a maximum sum
            let rand_cell = random_int(0, len);
            for (let cell of Object.entries(capital_map)) {
                if (cell[1] === max) {
                    if (rand_cell === 0) {
                        capital_cells.push(parseInt(cell[0]));
                    }
                    rand_cell--;
                }
            }
        }
        for (let i = 0; i < capital_cells.length; i++) {
            map[(capital_cells[i] / map_size | 0) * map_size + (capital_cells[i] % map_size)]['above'] = 'capital';
            map[(capital_cells[i] / map_size | 0) * map_size + (capital_cells[i] % map_size)]['tribe'] = tribes[i];
        }
        console.timeEnd('Capital distribution');
    }

    // terrain distribution
    if (!fill) {
        console.time('Terrain distribution');
        let done_tiles = [];
        let active_tiles = []; // done tiles that generate terrain around them
        for (let i = 0; i < capital_cells.length; i++) {
            done_tiles[i] = capital_cells[i];
            active_tiles[i] = [capital_cells[i]];
        }
        // we'll start from capital tiles and evenly expand until the whole map is covered
        while (done_tiles.length !== map_size**2) {
            for (let i = 0; i < tribes.length; i++) {
                if (active_tiles[i].length && tribes[i] !== 'Polaris') {
                    let rand_number = random_int(0, active_tiles[i].length);
                    let rand_cell = active_tiles[i][rand_number];
                    let neighbours = circle(rand_cell, 1);
                    let valid_neighbours = neighbours.filter(value => done_tiles.indexOf(value) === -1 && map[value]['type'] !== 'water');
                    if (!valid_neighbours.length) {
                        valid_neighbours = neighbours.filter(value => done_tiles.indexOf(value) === -1);
                    } // if there are no land tiles around, accept water tiles
                    if (valid_neighbours.length) {
                        let new_rand_number = random_int(0, valid_neighbours.length);
                        let new_rand_cell = valid_neighbours[new_rand_number];
                        map[new_rand_cell]['tribe'] = tribes[i];
                        active_tiles[i].push(new_rand_cell);
                        done_tiles.push(new_rand_cell);
                    } else {
                        active_tiles[i].splice(rand_number, 1); // deactivate tiles surrounded with done tiles
                    }
                }
            }
        }
        console.timeEnd('Terrain distribution');
    }

    // generate forest, mountains, and extra water according to terrain underneath
    let no_biomes_check = document.getElementById("no_biomes_check").checked;
    if (!no_biomes_check) {
        console.time('Biome generation');
        for (let cell = 0; cell < map_size**2; cell++) {
            if (map[cell]['type'] === 'ground' && map[cell]['above'] === null) {
                let rand = Math.random(); // 0 (---forest---)--nothing--(-mountain-) 1
                if (rand < general_probs['forest'] * terrain_probs['forest'][map[cell]['tribe']]) {
                    map[cell]['type'] = 'forest';
                } else if (rand > 1 - general_probs['mountain'] * terrain_probs['mountain'][map[cell]['tribe']]) {
                    map[cell]['type'] = 'mountain';
                }
                rand = Math.random(); // 0 (---water---)--------nothing-------- 1
                if (rand < terrain_probs['water'][map[cell]['tribe']]) {
                    map[cell]['type'] = 'ocean';
                }
            }
        }
        console.timeEnd('Biome generation');
    }

    // -1 - water far away
    // 0 - far away
    // 1 - border expansion
    // 2 - initial territory
    // 3 - village
    let village_map = [];
    if (!fill) {
        console.time('Initial village map');
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
        console.timeEnd('Initial village map');
    }
    // we'll place villages until there are none of 'far away' tiles

    // replace some ocean with shallow water
    console.time('Shallow water');
    let land_like_terrain = ['ground', 'forest', 'mountain'];
    for (let cell = 0; cell < map_size**2; cell++) {
        if (map[cell]['type'] === 'ocean') {
            for (let neighbour of plus_sign(cell)) {
                if (land_like_terrain.indexOf(map[neighbour]['type']) !== -1) {
                    map[cell]['type'] = 'water';
                    break;
                }
            }
        }
    }
    console.timeEnd('Shallow water');

    // mark tiles next to capitals according to the notation
    let village_count = 0;
    if (!fill) {
        console.time('Village map generation');
        for (let capital of capital_cells) {
            village_map[capital] = 3;
            for (let cell of circle(capital, 1)) {
                village_map[cell] = Math.max(village_map[cell], 2);
            }
            for (let cell of circle(capital, 2)) {
                village_map[cell] = Math.max(village_map[cell], 1);
            }
        }

        // generate villages & mark tiles next to them
        while (village_map.indexOf(0) !== -1) {
            let new_village = rand_array_element(village_map.map((cell, index) => cell === 0 ? index : null).filter(cell => cell !== null));
            village_map[new_village] = 3;
            for (let cell of circle(new_village, 1)) {
                village_map[cell] = Math.max(village_map[cell], 2);
            }
            for (let cell of circle(new_village, 2)) {
                village_map[cell] = Math.max(village_map[cell], 1);
            }
            village_count++;
        }
        console.timeEnd('Village map generation');
    }

    function proc(cell, probability) {
        return (village_map[cell] === 2 && Math.random() < probability) || (village_map[cell] === 1 && Math.random() < probability * BORDER_EXPANSION)
    }

    // generate resources
    let no_resources_check = document.getElementById("no_resources_check").checked;
    if (!no_resources_check && !no_biomes_check && !fill) {
        console.time('Resource generation');
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
                    }
                    break;
            }
        }
        console.timeEnd('Resource generation');
    }

    // ruins generation
    let ruins_number;
    if (!fill) {
        console.time('Ruin generation');
        ruins_number = Math.round(map_size**2/40);
        let water_ruins_number = Math.round(ruins_number/3);
        let ruins_count = 0;
        let water_ruins_count = 0;
        while (ruins_count < ruins_number) {
            let ruin = rand_array_element(village_map.map((cell, index) => cell === 0 || cell === 1 || cell === -1 ? index : null).filter(cell => cell !== null));
            let terrain = map[ruin].type;
            if (terrain !== 'water' && (water_ruins_count < water_ruins_number || terrain !== 'ocean')) {
                map[ruin].above = 'ruin'; // actually there can be both ruin and resource on a single tile but only ruin is displayed; as it is just a map generator it doesn't matter
                if (terrain === 'ocean') {
                    water_ruins_count++;
                }
                for (let cell of circle(ruin, 1)) {
                    village_map[cell] = Math.max(village_map[cell], 2); // we won't use this array anymore anyway
                }
                ruins_count++;
            }
        }
        console.timeEnd('Ruin generation');
    }

    function check_resources(resource, capital) {
        let resources = 0;
        for (let neighbour of circle(capital, 1)) {
            if (map[neighbour]['above'] === resource) {
                resources++;
            }
        }
        return resources;
    }

    function post_generate(resource, underneath, quantity, capital) {
        let resources = check_resources(resource, capital);
        while (resources < quantity) {
            let pos = random_int(0, 8);
            let territory = circle(capital, 1);
            map[territory[pos]]['type'] = underneath;
            map[territory[pos]]['above'] = resource;
            for (let neighbour of plus_sign(territory[pos])) {
                if (map[neighbour]['type'] === 'ocean') {
                    map[neighbour]['type'] = 'water';
                }
            }
            resources = check_resources(resource, capital);
        }
    }

    // tribe specific things
    console.time('Tribe specific');
    for (let capital of capital_cells) {
        switch (map[capital]['tribe']) {
            case 'Imperius':
                post_generate('fruit', 'ground', 2, capital);
                break;
            case 'Bardur':
                post_generate('game', 'forest', 2, capital);
                break;
            case 'Kickoo':
                let resources = check_resources('fish', capital);
                while (resources < 2) {
                    let pos = random_int(0, 4);
                    let territory = plus_sign(capital);
                    map[territory[pos]]['type'] = 'water';
                    map[territory[pos]]['above'] = 'fish';
                    for (let neighbour of plus_sign(territory[pos])) {
                        if (map[neighbour]['type'] === 'water') {
                            map[neighbour]['type'] = 'ocean';
                            for (let double_neighbour of plus_sign(neighbour)) {
                                if (map[double_neighbour]['type'] !== 'water' && map[double_neighbour]['type'] !== 'ocean') {
                                    map[neighbour]['type'] = 'water';
                                    break;
                                }
                            }
                        }
                    }
                    resources = check_resources('fish', capital);
                }
                break;
            case 'Zebasi':
                post_generate('crop', 'ground', 1, capital);
                break;
            case 'Elyrion':
                post_generate('game', 'forest', 2, capital);
                break;
            case 'Polaris':
                for (let neighbour of circle(capital, 1)) {
                    map[neighbour]['tribe'] = 'Polaris';
                }
                break;
        }
    }
    console.timeEnd('Tribe specific');
    // we're done!

    console.time('Display');
    display_map(map);
    console.timeEnd('Display');
    console.log('_______________________');
    console.log('Number of villages: ' + village_count);
    console.log('Number of ruins: ' + ruins_number);
    console.log('_______________________');

    // display text-map if necessary
    let text_output_check = document.getElementById("text_output_check").checked;
    if (text_output_check)
        print_map(map);
    else
        document.getElementById("text_display").style.display='none';
}

// we use pythagorean distances
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

// better ignore this part; broken assets turn map display into a mess with a ton of exceptions
function display_map(map) {
    let graphic_display = document.getElementById("graphic_display");
    graphic_display.width = graphic_display.width + 0;
    let canvas = graphic_display.getContext("2d");

    let tile_size = 1000 / map_size;

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
            canvas.drawImage(assets[type], x, y, tile_size, assets[type].height * tile_size / assets[type].width);
        } else if (tribe) {
            if (type === 'forest' || type === 'mountain') {
                canvas.drawImage(assets[tribe]['ground'], x, y, tile_size, assets[tribe]['ground'].height * tile_size / assets[tribe]['ground'].width);
                let lowering = tribe === 'Kickoo' && type === 'mountain' ? 0.82 : 0.52;
                canvas.drawImage(assets[tribe][type], x, y + lowering * tile_size - tile_size * assets[tribe][type].height / assets[tribe][type].width, tile_size, assets[tribe]['ground'].height * tile_size / assets[tribe]['ground'].width);
            } else if (type === 'water' || type === 'ocean') {
                canvas.drawImage(assets[tribe][type], x, y - 0.3 * tile_size, tile_size, assets[tribe][type].height * tile_size / assets[tribe][type].width);
            } else {
                canvas.drawImage(assets[tribe][type], x, y, tile_size, assets[tribe][type].height * tile_size / assets[tribe][type].width);
            }
        }

        function draw_above(image) {
            canvas.drawImage(image, x, y, tile_size, image.height * tile_size / image.width);
        }

        if (above === 'capital') {
            canvas.drawImage(assets[tribe]['capital'], x, y - 0.3 * tile_size, tile_size, assets[tribe]['capital'].height * tile_size / assets[tribe]['capital'].width);
        } else if (above === 'whale') {
            draw_above(assets['whale']);
        } else if (above === 'village') {
            draw_above(assets['village']);
        } else if (above === 'game') {
            draw_above(assets[tribe]['game']);
        } else if (above === 'fruit') {
            draw_above(assets[tribe]['fruit']);
        } else if (above === 'crop') {
            draw_above(assets['crop']);
        } else if (above === 'fish') {
            draw_above(assets['fish']);
        } else if (above === 'metal') {
            draw_above(assets['metal']);
        } else if (above === 'ruin') {
            draw_above(assets['ruin']);
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

function round(center, radius) {
    let round = [];
    for (let r = 1; r <= radius; r++) {
        round = round.concat(circle(center, r));
    }
    round.push(center);
    return round;
}

function plus_sign(center) {
    let plus_sign = [];
    let row = center / map_size | 0;
    let column = center % map_size;
    if (column > 0) {
        plus_sign.push(center - 1);
    }
    if (column < map_size - 1) {
        plus_sign.push(center + 1);
    }
    if (row > 0) {
        plus_sign.push(center - map_size);
    }
    if (row < map_size - 1) {
        plus_sign.push(center + map_size);
    }
    return plus_sign;
}
