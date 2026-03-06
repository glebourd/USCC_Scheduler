export const INITIAL_CREWS = [
    { id: 1, name: 'Crew 1 (Lead)', isLead: true, leader: 'Alex' },
    { id: 2, name: 'Crew 2 (Lead)', isLead: true, leader: 'Tyler' },
    { id: 3, name: 'Crew 3 (Lead)', isLead: true, leader: 'Lead 3' },
    { id: 4, name: 'Crew 4 (Helper)', isLead: false, leader: 'Helper' },
];

export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

export const INITIAL_BACKLOG = [
    { id: 'b1', name: 'Miller High-Story Screen', type: 'Screen', value: 8500, duration: 2, location: 'Cincinnati', subRegion: 'North', address: '1200 Mason-Montgomery Rd, Mason, OH', complexity: 'Complex', hasElectrical: true, elevation: '2nd Story', materialsReady: true, siteReady: true },
    { id: 'b2', name: 'Downtown Pergola', type: 'Pergola', value: 25000, duration: 4, location: 'Louisville', subRegion: 'Central', address: '400 Main St, Louisville, KY', complexity: 'Complex', hasElectrical: true, elevation: 'Ground', materialsReady: true, siteReady: true },
    { id: 'b3', name: 'Small Repair', type: 'Service', value: 450, duration: 1, location: 'Louisville', subRegion: 'South', address: '9 Dixie Hwy, Louisville, KY', complexity: 'Standard', hasElectrical: false, elevation: 'Ground', materialsReady: true, siteReady: true },
];
