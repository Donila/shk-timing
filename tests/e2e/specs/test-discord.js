
describe('Discord Bot Import Test', () => {
    it('Should import armies from Discord bot output', () => {
        cy.on('uncaught:exception', (err, runnable) => {
            return false;
        });
        cy.visit('/');
        cy.wait(1000); // Wait for app to settle

        // Open Discord dialog
        // Click the button wrapper instead of the image to ensure clickability
        cy.get('.button.info').click({ force: true });

        // Wait for dialog to open
        cy.get('.v-dialog__content--active').should('exist');
        cy.wait(500); // Animation wait

        // Read the file and paste content
        cy.readFile('tests/test-discord.txt').then((text) => {
            cy.get('textarea[aria-label="???"]').should('be.visible').click().type(text, { delay: 0, force: true });
            cy.contains('button', 'Save').click({ force: true });
        });

        cy.wait(500); // Wait for save processing

        // Verify first column values (Names)
        const expectedNames = ['44:51', '20:38:34', '22:39:41'];
        expectedNames.forEach((name) => {
            cy.contains('td', name).should('be.visible');
        });

        // Verify internally that armies were added with correct times (466, 34348, 15505)
        cy.window().then((win) => {
            const app = win.document.querySelector('#app').__vue__;
            // Depending on how store is attached, usually $root.$data has the state if using simple state management
            const armies = app.$root.$data.state.armies;
            const times = armies.map(a => a.time);
            expect(times).to.include(466);
            expect(times).to.include(34348);
            expect(times).to.include(15505);
        });

        cy.get('table.v-datatable tbody tr').should('have.length', 3);
    });
});
