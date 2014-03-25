var Browser = require('zombie');
require('chai').should();

var express = require('express');
express().use(express.static('build/compile')).listen(3000);


describe('visit', function() {
    before(function(done) {
        this.browser = new Browser();
        this.browser.visit('http://localhost:3000/main.html').then(done).fail(done);
    });

    it('should show the page', function() {
        this.browser.success.should.be.equal(true);
    });

    it('should have the expected title', function() {
        this.browser.text('title').should.be.equal('Client side app example');
    });
});
