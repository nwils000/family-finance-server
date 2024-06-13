# Generated by Django 5.0.6 on 2024-06-12 12:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app_family_finance', '0013_alter_responsibility_difficulty'),
    ]

    operations = [
        migrations.AlterField(
            model_name='responsibility',
            name='difficulty',
            field=models.IntegerField(choices=[(0, 'Awaiting Verification'), (1, 'Super Easy'), (2, 'Easy'), (3, 'Medium'), (4, 'Hard'), (5, 'Very Hard'), (6, 'Extreme')], default=0),
        ),
    ]
