(function ($) {
    $(document).ready(function() {
        const $results = $('#results');

        $('#logs-form').on('submit', function(e) {
            e.preventDefault();
            $results.html('<span>Loading...</span>');
            const $this = $(this);
            const url = $this.attr('action');
            const data = $this.serialize();
            $.get(url, data, function(logs) {
                let html = '';
                $results.html('');
                if (Array.isArray(logs) && logs.length > 0) {
                    html = `<table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Duration</th>
                        </tr>
                    </thead>
                    <tbody>`;

                    for(let i = 0; i < logs.length; i++) {
                        const v = logs[i];
                        html += `
                        <tr>
                            <td>${new Date(v.date).toLocaleDateString('en-US')}</td>
                            <td>${v.description}</td>
                            <td>${v.duration}</td>
                        </tr>`;
                    }

                    html += '</tbody></table>';
                } else {
                    html = '<p>No results</p>';
                }
                $results.html(html);
            });
        });
    });
})(jQuery);
